import type { ReactNode } from 'react';

export type LegalSlug = 'privacy' | 'termini' | 'community-rules' | 'cookie-policy';
export type LegalPageProps = { onClose: () => void; onNavigate: (slug: LegalSlug) => void };
type Section = { heading: string; paragraphs: string[] };
export const legalDocuments: { slug: LegalSlug; title: string }[] = [
  { slug: 'privacy', title: 'Privacy Policy' },
  { slug: 'termini', title: 'Termini e condizioni' },
  { slug: 'community-rules', title: 'Regolamento Community' },
  { slug: 'cookie-policy', title: 'Cookie Policy' },
];
export function LegalLayout({title, sections, onClose, onNavigate}: LegalPageProps & {title: string; sections: Section[]}) {
  return <div className="fixed inset-0 z-[250] flex flex-col bg-gray-50" role="dialog" aria-modal="true" aria-label={title}>
    <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div><p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">Flode · Documenti legali</p><h1 className="text-lg font-bold text-gray-900">{title}</h1></div>
      <button type="button" onClick={onClose} aria-label="Chiudi documento" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">Chiudi ✕</button>
    </header>
    <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-5 shadow-sm sm:p-9">
        {sections.map((section, index) => <section key={index} className="mb-7"><h2 className="mb-3 text-lg font-semibold text-gray-900">{section.heading}</h2>{section.paragraphs.map((paragraph,i) => <p key={i} className="mb-3 whitespace-pre-line text-sm leading-7 text-gray-700">{paragraph}</p>)}</section>)}
        <p className="mt-8 text-sm text-gray-500">Contatti: <a className="text-cyan-700 underline" href="mailto:privacy@flodeapp.it">privacy@flodeapp.it</a></p>
      </article>
      <nav aria-label="Altri documenti legali" className="mx-auto my-6 flex max-w-3xl flex-wrap justify-center gap-2">
        {legalDocuments.filter(d => d.title !== title).map(d => <button type="button" key={d.slug} onClick={() => onNavigate(d.slug)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-cyan-700">{d.title}</button>)}
      </nav>
    </main>
  </div>;
}