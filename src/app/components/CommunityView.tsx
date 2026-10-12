import { MessageCircle, Users } from 'lucide-react';

export function CommunityView() {
  return (
    <main className="h-full overflow-y-auto bg-[#050914] px-5 pt-8 pb-24 text-white">
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-semibold tracking-widest text-cyan-400">FLODE COMMUNITY</p>
        <h1 className="mt-2 text-3xl font-bold">La città si incontra qui.</h1>
        <p className="mt-3 text-slate-300">Conosci chi partecipa agli eventi e organizzati per uscire insieme.</p>
        <div className="mt-8 space-y-4">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <Users className="mb-3 h-7 w-7 text-cyan-400" />
            <h2 className="text-lg font-semibold">Chat degli eventi</h2>
            <p className="mt-2 text-sm text-slate-300">Presto potrai parlare con chi partecipa ai tuoi eventi preferiti.</p>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <MessageCircle className="mb-3 h-7 w-7 text-cyan-400" />
            <h2 className="text-lg font-semibold">Messaggi privati</h2>
            <p className="mt-2 text-sm text-slate-300">Continua le conversazioni con le persone che conosci su Flode.</p>
          </section>
        </div>
      </div>
    </main>
  );
}