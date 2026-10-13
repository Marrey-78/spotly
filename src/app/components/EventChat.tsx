import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, MessageCircle, Send, RefreshCw, AlertCircle, Loader2, Flag, MoreVertical, X } from 'lucide-react';
import type { Event } from '../types/event';

type ChatMessage = {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string | null;
  content: string;
  created_at: string;
};

type Props = {
  event: Event;
  isLoggedIn: boolean;
  currentUserId?: string;
  onClose: () => void;
  onLoginRequired: () => void;
};

// Solo URL esplicito: nessun fallback alla produzione.
const API_BASE = (import.meta.env.VITE_COMMUNITY_API_URL as string | undefined)?.replace(/\/$/, '');
const timeFormatter = new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' });
const dateFormatter = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

function dateKey(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function dayLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Messaggi';
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (dateKey(value) === dateKey(today.toISOString())) return 'Oggi';
  if (dateKey(value) === dateKey(yesterday.toISOString())) return 'Ieri';
  return dateFormatter.format(date);
}

function initials(name: string): string {
  return (name || 'Utente').trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('');
}

export function EventChat({ event, isLoggedIn, currentUserId, onClose, onLoginRequired }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [retrySeconds, setRetrySeconds] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [reportTarget, setReportTarget] = useState<ChatMessage | null>(null);
  const [reportReason, setReportReason] = useState('Spam o pubblicità indesiderata');
  const [reportSending, setReportSending] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');
  const [menuMessageId, setMenuMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldStickRef = useRef(true);
  const busyRef = useRef(false);
  const initialLoadRef = useRef(true);
  const notFoundRef = useRef(false);

  useEffect(() => {
    if (retrySeconds <= 0) return;
    const timer = window.setTimeout(() => setRetrySeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [retrySeconds]);

  const loadMessages = useCallback(async (signal?: AbortSignal) => {
    if (!API_BASE) {
      setError('Configura VITE_COMMUNITY_API_URL nel file .env.local.');
      setLoading(false);
      return;
    }
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const response = await fetch(`${API_BASE}/community/events/${encodeURIComponent(event.id)}/messages`, { signal });
      if (response.status === 404) {
        setNotFound(true);
        notFoundRef.current = true;
        throw new Error('Questo evento non è presente nel database Community.');
      }
      if (!response.ok) throw new Error(`Impossibile caricare la chat (${response.status}).`);
      const data: ChatMessage[] = await response.json();
      if (!signal?.aborted) {
        setMessages(data);
        setError('');
        setNotFound(false);
        notFoundRef.current = false;
      }
    } catch (err) {
      if (!signal?.aborted) setError(err instanceof Error ? err.message : 'Errore nel caricamento dei messaggi.');
    } finally {
      busyRef.current = false;
      if (!signal?.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [event.id]);

  useEffect(() => {
    const controller = new AbortController();
    setMessages([]);
    setDraft('');
    setRetrySeconds(0);
    setReportTarget(null);
    setMenuMessageId(null);
    setReportSuccess('');
    setError('');
    setNotFound(false);
    notFoundRef.current = false;
    setLoading(true);
    shouldStickRef.current = true;
    initialLoadRef.current = true;
    void loadMessages(controller.signal);
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible' && !notFoundRef.current) void loadMessages(controller.signal);
    }, 5000);
    return () => { controller.abort(); window.clearInterval(interval); };
  }, [loadMessages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || loading) return;
    if (initialLoadRef.current || shouldStickRef.current) {
      el.scrollTop = el.scrollHeight;
      initialLoadRef.current = false;
    }
  }, [messages, loading]);

  const trackScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    shouldStickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || sending || notFound || retrySeconds > 0) return;
    if (!isLoggedIn) { onLoginRequired(); return; }
    const token = localStorage.getItem('token');
    if (!token) { onLoginRequired(); return; }
    if (!API_BASE) { setError('API Community non configurata.'); return; }
    setSending(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/community/events/${encodeURIComponent(event.id)}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (response.status === 401) throw new Error('Sessione scaduta: effettua nuovamente l’accesso.');
      if (response.status === 429) {
        const payload = await response.json().catch(() => ({}));
        const headerSeconds = Number(response.headers.get('Retry-After'));
        const detail = typeof payload.detail === 'string' ? payload.detail : '';
        const match = detail.match(/(\d+)\s*second/i);
        const seconds = Number.isFinite(headerSeconds) && headerSeconds > 0
          ? Math.ceil(headerSeconds)
          : match ? Number(match[1]) : 30;
        setRetrySeconds(Math.max(1, seconds));
        setError('');
        return;
      }
      if (!response.ok) throw new Error(`Invio non riuscito (${response.status}).`);
      setDraft('');
      shouldStickRef.current = true;
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante l’invio.');
    } finally {
      setSending(false);
    }
  };

  const submitReport = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reportTarget || reportSending) return;
    const token = localStorage.getItem('token');
    if (!isLoggedIn || !token) {
      setReportError('Accedi a Flode per segnalare un messaggio.');
      return;
    }
    if (!API_BASE) {
      setReportError('API Community non configurata.');
      return;
    }
    setReportSending(true);
    setReportError('');
    try {
      const response = await fetch(`${API_BASE}/community/messages/${encodeURIComponent(reportTarget.id)}/report`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reportReason }),
      });
      if (response.status === 409) throw new Error('Hai già segnalato questo messaggio.');
      if (response.status === 401) throw new Error('Sessione scaduta. Accedi nuovamente.');
      if (response.status === 400) throw new Error('Non puoi segnalare un tuo messaggio.');
      if (!response.ok) throw new Error(`Segnalazione non riuscita (${response.status}).`);
      setReportTarget(null);
      setReportSuccess('Segnalazione inviata. Grazie per averci aiutato a mantenere sicura la Community.');
    } catch (err) {
      setReportError(err instanceof Error ? err.message : 'Errore durante la segnalazione.');
    } finally {
      setReportSending(false);
    }
  };

  const refresh = () => {
    setRefreshing(true);
    void loadMessages();
  };

  return (
    <div className="fixed inset-0 z-[230] flex items-end justify-center bg-slate-950/75 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label={`Chat di ${event.title}`}>
      <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#0B1324] text-white sm:h-[min(90dvh,780px)] sm:max-w-lg sm:rounded-3xl sm:border sm:border-white/10 sm:shadow-2xl">
        <header className="relative flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#111E34] px-3 py-3 shadow-lg">
          <button type="button" onClick={onClose} aria-label="Torna all'evento" className="rounded-full p-2.5 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"><ArrowLeft className="h-5 w-5" /></button>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-lg shadow-blue-500/20">
            {event.image ? <img src={event.image} alt="" className="h-full w-full object-cover" /> : <MessageCircle className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold leading-5">{event.title}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-300"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Community dell'evento</p>
          </div>
          <button type="button" onClick={refresh} disabled={refreshing || loading} aria-label="Aggiorna messaggi" className="rounded-full p-2.5 text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-40"><RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} /></button>
        </header>

        <div ref={scrollRef} onScroll={trackScroll} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5 sm:px-5" aria-live="polite" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(34,211,238,0.045), transparent 35%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.055), transparent 40%)' }}>
          {loading && <div className="flex items-center justify-center gap-2 pt-12 text-sm text-slate-400"><Loader2 className="h-4 w-4 animate-spin" /> Caricamento messaggi…</div>}
          {!loading && !error && messages.length === 0 && (
            <div className="mx-auto flex max-w-xs flex-col items-center pt-14 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-300"><MessageCircle className="h-8 w-8" /></div>
              <h3 className="text-lg font-bold">La conversazione inizia qui</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Presentati, fai una domanda o trova qualcuno con cui partecipare all'evento.</p>
            </div>
          )}
          {messages.map((message, index) => {
            const mine = !!currentUserId && message.sender_id === currentUserId;
            const showDay = index === 0 || dateKey(messages[index - 1].created_at) !== dateKey(message.created_at);
            const name = message.sender_name || 'Utente';
            const timestamp = new Date(message.created_at);
            const validTime = !Number.isNaN(timestamp.getTime());
            return (
              <div key={message.id}>
                {showDay && <div className="my-5 flex justify-center"><span className="rounded-full border border-white/10 bg-[#22314B] px-3 py-1 text-[11px] font-medium text-slate-300 shadow-sm">{dayLabel(message.created_at)}</span></div>}
                <div className={`mb-3 flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                  {!mine && <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-500/80 to-violet-600/80 text-[11px] font-bold text-white ring-2 ring-white/10">{message.sender_avatar ? <img src={message.sender_avatar} alt="" className="h-full w-full object-cover" /> : initials(name)}</div>}
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-md ${mine ? 'rounded-br-md bg-gradient-to-br from-cyan-600 to-blue-600 text-white' : 'rounded-bl-md border border-white/5 bg-[#1C2A42] text-slate-100'}`}>
                    {!mine && <p className="mb-1 text-xs font-bold text-cyan-300">{name}</p>}
                    <p className="whitespace-pre-wrap break-words text-[14px] leading-[1.45]">{message.content}</p>
                    <p className={`mt-1.5 text-right text-[10px] ${mine ? 'text-cyan-100/75' : 'text-slate-400'}`}>{validTime ? timeFormatter.format(timestamp) : ''}</p>
                  </div>
                  {!mine && isLoggedIn && (
                    <div className="relative self-center">
                      <button type="button" aria-label={`Opzioni messaggio di ${name}`} aria-expanded={menuMessageId === message.id} onClick={() => setMenuMessageId(menuMessageId === message.id ? null : message.id)} className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"><MoreVertical className="h-4 w-4" /></button>
                      {menuMessageId === message.id && (
                        <div className="absolute left-0 top-full z-20 mt-1 w-36 rounded-xl border border-white/10 bg-[#24334B] p-1 shadow-xl">
                          <button type="button" onClick={() => { setReportTarget(message); setReportReason('Spam o pubblicità indesiderata'); setReportError(''); setReportSuccess(''); setMenuMessageId(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-white hover:bg-white/10"><Flag className="h-4 w-4 text-cyan-300" /> Segnala</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {reportSuccess && <div role="status" className="border-t border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-xs text-cyan-100">{reportSuccess}</div>}
        {retrySeconds > 0 && <div role="status" className="flex items-start gap-2 border-t border-amber-400/20 bg-amber-400/10 px-4 py-2.5 text-xs text-amber-100"><AlertCircle className="h-4 w-4 shrink-0" /><span>Hai inviato troppi messaggi. Potrai inviarne un altro tra <strong>{retrySeconds} secondi</strong>. Il tuo testo rimane salvato.</span></div>}
        {error && <div role="alert" className="flex items-start gap-2 border-t border-red-400/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-200"><AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span></div>}
        <form onSubmit={sendMessage} className="flex shrink-0 items-end gap-2 border-t border-white/10 bg-[#111E34] px-3 py-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-4">
          {!isLoggedIn ? (
            <button type="button" onClick={onLoginRequired} className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 font-bold text-slate-950">Accedi per partecipare alla chat</button>
          ) : (
            <>
              <input value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={2000} disabled={notFound} placeholder="Scrivi un messaggio…" aria-label="Messaggio" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#24334B] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-400 disabled:opacity-50" />
              <button type="submit" disabled={!draft.trim() || sending || notFound || retrySeconds > 0} aria-label={retrySeconds > 0 ? `Attendi ${retrySeconds} secondi` : 'Invia messaggio'} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/15 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100">{sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}</button>
            </>
          )}
        </form>
        {reportTarget && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 px-4" role="dialog" aria-modal="true" aria-label="Segnala messaggio">
            <form onSubmit={submitReport} className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#172438] p-5 shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold"><Flag className="h-5 w-5 text-cyan-300" /> Segnala messaggio</h2>
                <button type="button" onClick={() => setReportTarget(null)} disabled={reportSending} aria-label="Chiudi segnalazione" className="rounded-full p-2 text-slate-300 hover:bg-white/10"><X className="h-5 w-5" /></button>
              </div>
              <p className="mb-3 text-sm text-slate-300">Seleziona il motivo della segnalazione. Il messaggio verrà esaminato, non eliminato automaticamente.</p>
              <p className="mb-4 line-clamp-3 rounded-xl bg-white/5 p-3 text-xs text-slate-300">{reportTarget.content}</p>
              <div className="space-y-2">
                {['Spam o pubblicità indesiderata', 'Molestie o insulti', 'Contenuto offensivo', 'Altro motivo'].map((reason) => (
                  <label key={reason} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 px-3 py-2.5 text-sm">
                    <input type="radio" name="reportReason" checked={reportReason === reason} onChange={() => setReportReason(reason)} className="accent-cyan-400" />{reason}
                  </label>
                ))}
              </div>
              {reportError && <p role="alert" className="mt-3 text-sm text-red-300">{reportError}</p>}
              <button type="submit" disabled={reportSending} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 font-bold text-slate-950 disabled:opacity-50">{reportSending && <Loader2 className="h-4 w-4 animate-spin" />}{reportSending ? 'Invio…' : 'Invia segnalazione'}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}