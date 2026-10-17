import { LegalLayout, type LegalPageProps } from './LegalLayout';

const sections = [
  {
    "heading": "1. Titolare e ambito",
    "paragraphs": [
      "Titolare del trattamento e gestore del servizio: Gabriele Trovato, persona fisica. Contatto privacy: privacy@flodeapp.it. Sito: https://flodeapp.it. In Torino . Questa informativa riguarda cookie, identificatori e tecnologie analoghe impiegati sul sito e sulla web app."
    ]
  },
  {
    "heading": "2. Tecnologie tecniche",
    "paragraphs": [
      "Il servizio può utilizzare meccanismi tecnici strettamente necessari per autenticazione, sicurezza e funzionamento. [EFFETTUARE audit effettivo di cookie, localStorage, sessionStorage e SDK; indicare nomi, finalità, fornitori e durata]."
    ]
  },
  {
    "heading": "3. Google Analytics",
    "paragraphs": [
      "Flode utilizza Google Analytics secondo la configurazione da verificare. Prima dell’attivazione di strumenti di analisi non esenti, occorre raccogliere un consenso valido e impedire l’installazione o attivazione preventiva di cookie/identificatori non necessari. [VERIFICARE GA4, Consent Mode, anonimizzazione, eventi inviati, cookie effettivi]."
    ]
  },
  {
    "heading": "4. Google Maps e contenuti esterni",
    "paragraphs": [
      "L’integrazione Google Maps può comportare richieste a Google e l’uso di tecnologie di tracciamento. [VERIFICARE modalità di caricamento e se è necessario consenso preventivo, blocco o soluzione alternativa]."
    ]
  },
  {
    "heading": "5. Scelte dell’utente",
    "paragraphs": [
      "[DA IMPLEMENTARE/VERIFICARE: banner e pannello preferenze con rifiuto e accettazione parimenti accessibili, gestione delle categorie, revoca semplice del consenso e registro delle scelte ove opportuno]. Le impostazioni del browser possono consentire ulteriori controlli."
    ]
  },
  {
    "heading": "6. Elenco delle tecnologie",
    "paragraphs": [
      "[DA COMPILARE DOPO AUDIT] Tabella richiesta: nome tecnologia; fornitore; dominio; finalità; durata; categoria; base giuridica; eventuale trasferimento internazionale."
    ]
  },
  {
    "heading": "7. Aggiornamenti e diritti",
    "paragraphs": [
      "Per informazioni sui trattamenti e per esercitare i diritti previsti dal GDPR, consultare la Privacy Policy o scrivere a privacy@flodeapp.it.",
      "Contatto: privacy@flodeapp.it  |  https://flodeapp.it"
    ]
  }
];

export function CookiePolicy(props: LegalPageProps) {
  return <LegalLayout title="Cookie Policy" sections={sections} {...props} />;
}