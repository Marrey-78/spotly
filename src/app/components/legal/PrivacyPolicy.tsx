import { LegalLayout, type LegalPageProps } from './LegalLayout';

const sections = [
  {
    "heading": "1. Ambito e titolare",
    "paragraphs": [
      "Titolare del trattamento e gestore del servizio: Gabriele Trovato, persona fisica. Contatto privacy: privacy@flodeapp.it. Sito: https://flodeapp.it. [DA COMPLETARE: domicilio o altro recapito del titolare idoneo agli obblighi applicabili; eventuali dati fiscali/professionali]. La presente informativa riguarda il sito e la web app Flode e i servizi collegati."
    ]
  },
  {
    "heading": "2. Dati trattati",
    "paragraphs": [
      "Dati di registrazione e account (nome, email, identificativi tecnici e di autenticazione); dati dei preferiti; informazioni di locali, organizzatori ed eventi quando pubblicate dagli interessati; messaggi nelle chat degli eventi, autore, orario, modifiche e cancellazioni; segnalazioni e relativi esiti; dati tecnici di accesso, sicurezza e utilizzo; eventuali dati di posizione forniti o autorizzati dall’utente per visualizzare eventi vicini. I messaggi possono contenere informazioni personali immesse volontariamente dagli utenti, anche su terzi."
    ]
  },
  {
    "heading": "3. Finalità e basi giuridiche",
    "paragraphs": [
      "Gestire account, accesso, preferiti e chat: esecuzione del contratto (art. 6(1)(b) GDPR), nei limiti pertinenti. Sicurezza, prevenzione abusi, moderazione, tutela del servizio e gestione delle segnalazioni: legittimo interesse (art. 6(1)(f)), previa valutazione di bilanciamento, oppure obbligo legale ove applicabile. Adempimenti normativi e richieste delle autorità: obbligo legale (art. 6(1)(c)). Analytics e tecnologie non necessarie: consenso, quando richiesto dalla normativa cookie/ePrivacy. Geolocalizzazione del dispositivo: previa autorizzazione tecnica e verifica della base giuridica applicabile; deve essere possibile utilizzare le funzioni non dipendenti dalla posizione senza concederla."
    ]
  },
  {
    "heading": "4. Chat e visibilità",
    "paragraphs": [
      "I messaggi sono visibili agli altri utenti che possono accedere alla chat dell’evento, secondo le impostazioni effettive dell’app [VERIFICARE: chat pubbliche anche a utenti non autenticati?]. Non inserire dati sensibili, numeri di telefono, indirizzi o dati di terzi. Le segnalazioni e gli strumenti di moderazione non sono destinati alla consultazione pubblica."
    ]
  },
  {
    "heading": "5. Moderazione automatizzata",
    "paragraphs": [
      "I contenuti dei messaggi possono essere analizzati tramite un servizio esterno di moderazione AI fornito da OpenAI per individuare possibili violazioni. Secondo il funzionamento previsto, la segnalazione automatica è sottoposta a verifica umana; non sono previste decisioni esclusivamente automatizzate con effetti giuridici o analogamente significativi. [VERIFICARE codice effettivamente distribuito, dati inviati e policy del fornitore]."
    ]
  },
  {
    "heading": "6. Destinatari e fornitori",
    "paragraphs": [
      "I dati possono essere trattati, per le rispettive funzioni, da fornitori infrastrutturali e tecnologici: Railway (hosting/backend e database), Google/Firebase (autenticazione), Google Maps (mappe e geolocalizzazione), Google Analytics (misurazione, se attiva), OpenAI (moderazione AI), eventuali fornitori email e hosting del dominio. Identità contrattuali, ruoli privacy, accordi DPA, regioni di trattamento e subfornitori devono essere verificati e documentati. Non si presume che tutti siano responsabili del trattamento per ogni funzione."
    ]
  },
  {
    "heading": "7. Trasferimenti extra SEE",
    "paragraphs": [
      "Alcuni fornitori possono trattare dati al di fuori dello Spazio Economico Europeo. Prima della pubblicazione occorre verificare paesi, garanzie applicabili (ad esempio decisioni di adeguatezza o clausole contrattuali standard, ove pertinenti) e fornire informazioni più specifiche."
    ]
  },
  {
    "heading": "8. Conservazione",
    "paragraphs": [
      "I dati dell’account sono conservati finché necessario alla gestione del rapporto e per ulteriori periodi giustificati da obblighi o controversie. Per i messaggi si propone una cancellazione ordinaria entro 30 giorni dalla fine dell’evento, salvo segnalazioni, esigenze di sicurezza o obblighi documentati: [PROPOSTA, NON ANCORA IMPLEMENTATA — confermare ed implementare prima della pubblicazione]. Segnalazioni e log: [DEFINIRE tempi e criteri effettivi]. Backup: [DEFINIRE durata e modalità di cancellazione]."
    ]
  },
  {
    "heading": "9. Diritti degli interessati",
    "paragraphs": [
      "È possibile richiedere accesso, rettifica, cancellazione, limitazione, portabilità ove applicabile, opposizione ai trattamenti fondati sul legittimo interesse e revoca del consenso senza pregiudicare la liceità del trattamento precedente. Scrivere a privacy@flodeapp.it. Le richieste saranno gestite nei termini previsti dal GDPR, normalmente entro un mese, salvo proroghe motivate. È possibile proporre reclamo al Garante per la protezione dei dati personali."
    ]
  },
  {
    "heading": "10. Minori",
    "paragraphs": [
      "[DECIDERE età minima e misure di verifica]. Fino alla definizione di una policy coerente, non presentare il servizio come specificamente rivolto ai minori. Eventuali consensi digitali di minori richiedono un’analisi della disciplina applicabile."
    ]
  },
  {
    "heading": "11. Sicurezza e aggiornamenti",
    "paragraphs": [
      "Sono adottate misure tecniche e organizzative proporzionate al rischio, da verificare: autorizzazioni API, controllo accessi, protezione delle credenziali, cifratura del traffico, backup, logging, gestione incidenti e richieste di cancellazione. La policy sarà aggiornata quando cambieranno funzionalità o fornitori.",
      "Contatto: privacy@flodeapp.it  |  https://flodeapp.it"
    ]
  }
];

export function PrivacyPolicy(props: LegalPageProps) {
  return <LegalLayout title="Privacy Policy" sections={sections} {...props} />;
}