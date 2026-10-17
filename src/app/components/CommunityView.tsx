import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, MessageCircle, RefreshCw, Search } from 'lucide-react';

export interface CommunityChatSummary {
  room_id: string;
  event_id: string;
  event_title: string;
  event_date: string | null;
  last_message_id: string;
  last_message_content: string;
  last_message_at: string;
  last_message_sender_id: string;
  last_message_sender_name: string;
}

interface CommunityViewProps {
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  onOpenChat: (chat: CommunityChatSummary) => void;
}

const API_URL = import.meta.env.VITE_API_URL;

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });
}

export function CommunityView({ isLoggedIn, onLoginRequired, onOpenChat }: CommunityViewProps) {
  const [chats, setChats] = useState<CommunityChatSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadChats = useCallback(async (signal?: AbortSignal, silent = false) => {
    if (!isLoggedIn) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Sessione non disponibile. Accedi nuovamente.');
      return;
    }
    if (!silent) setLoading(true);
    if (!silent) setError('');
    try {
      const response = await fetch(`${API_URL}/community/my-chats`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      if (!response.ok) throw new Error(response.status === 401 ? 'Sessione scaduta. Accedi nuovamente.' : `Errore nel caricamento delle chat (${response.status}).`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Risposta del server non valida.');
      if (!signal?.aborted) {
        setChats([...data].sort((a: CommunityChatSummary, b: CommunityChatSummary) =>
          new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
        ));
        setError('');
      }
    } catch (err) {
      if (!signal?.aborted && !silent) setError(err instanceof Error ? err.message : 'Impossibile caricare le chat.');
    } finally {
      if (!signal?.aborted && !silent) setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const controller = new AbortController();
    if (isLoggedIn) void loadChats(controller.signal);
    const interval = isLoggedIn ? window.setInterval(() => {
      if (document.visibilityState === 'visible') void loadChats(controller.signal, true);
    }, 5000) : undefined;
    return () => {
      controller.abort();
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [isLoggedIn, loadChats]);

  const visibleChats = chats.filter((chat) =>
    `${chat.event_title} ${chat.last_message_content} ${chat.last_message_sender_name}`
      .toLocaleLowerCase('it-IT').includes(search.toLocaleLowerCase('it-IT'))
  );

  return (
    <main className="h-full overflow-y-auto bg-[#050914] px-5 pt-8 pb-28 text-white">
      <div className="mx-auto max-w-xl">
        <p className="text-xs font-bold tracking-[0.22em] text-cyan-400">FLODE COMMUNITY</p>
        <h1 className="mt-2 text-3xl font-bold">Le mie chat</h1>
        <p className="mt-2 text-sm text-slate-400">Ritrova le persone e gli eventi con cui sei in contatto.</p>

        {!isLoggedIn ? (
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
            <MessageCircle className="mx-auto mb-3 h-9 w-9 text-cyan-400" />
            <h2 className="text-lg font-semibold">Entra nella Community</h2>
            <p className="mt-2 text-sm text-slate-400">Accedi per vedere le conversazioni a cui hai partecipato.</p>
            <button type="button" onClick={onLoginRequired} className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950">Accedi a Flode</button>
          </section>
        ) : (
          <>
            <label className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca nelle tue chat..." aria-label="Cerca nelle tue chat" className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none" />
            </label>
            <div className="mt-7 mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Conversazioni</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-cyan-400">{chats.length} chat</span>
                <button type="button" onClick={() => void loadChats()} disabled={loading} title="Aggiorna chat" aria-label="Aggiorna chat" className="text-slate-400 hover:text-cyan-300 disabled:opacity-40"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>
              </div>
            </div>
            {error && <div role="alert" className="mb-3 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</div>}
            {loading && chats.length === 0 ? <p className="py-8 text-center text-sm text-slate-400">Caricamento conversazioni...</p> : null}
            {!loading && !error && chats.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-7 text-center">
                <MessageCircle className="mx-auto mb-3 h-8 w-8 text-cyan-400" />
                <p className="font-semibold">Ancora nessuna conversazione</p>
                <p className="mt-2 text-sm text-slate-400">Apri un evento e invia il tuo primo messaggio per ritrovarlo qui.</p>
              </div>
            ) : null}
            {!loading && chats.length > 0 && visibleChats.length === 0 ? <p className="py-8 text-center text-sm text-slate-400">Nessuna chat corrisponde alla ricerca.</p> : null}
            <div className="space-y-3">
              {visibleChats.map((chat) => (
                <button key={chat.room_id} type="button" onClick={() => onOpenChat(chat)} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-[#142136] p-3.5 text-left transition hover:border-cyan-400/40 hover:bg-[#192a43]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 text-xl font-bold">{chat.event_title?.trim().charAt(0).toUpperCase() || 'F'}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-semibold">{chat.event_title}</span>
                      <span className="shrink-0 text-[11px] text-slate-400">{formatWhen(chat.last_message_at)}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-300">{chat.last_message_sender_name}: {chat.last_message_content}</p>
                    {chat.event_date && <p className="mt-1.5 flex items-center gap-1 text-[11px] text-cyan-300/80"><CalendarDays className="h-3 w-3" />{new Date(`${chat.event_date.slice(0, 10)}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-500" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}