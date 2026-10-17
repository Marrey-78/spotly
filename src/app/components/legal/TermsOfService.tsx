import { LegalLayout, type LegalPageProps } from './LegalLayout';

const sections = [
  {
    "heading": "1. Gestore e oggetto",
    "paragraphs": [
      "Titolare del trattamento e gestore del servizio: Gabriele Trovato, persona fisica. Contatto privacy: privacy@flodeapp.it. Sito: https://flodeapp.it. [DA COMPLETARE: domicilio o altro recapito del titolare idoneo agli obblighi applicabili; eventuali dati fiscali/professionali]. Flode è una piattaforma per scoprire eventi e, ove disponibili, utilizzare preferiti, account e chat collegate agli eventi."
    ]
  },
  {
    "heading": "2. Accettazione e requisiti",
    "paragraphs": [
      "L’uso del servizio comporta il rispetto di questi termini. La creazione dell’account può richiedere l’accettazione espressa dei termini. [DA DEFINIRE: età minima, eventuali limiti territoriali e procedura di accettazione]."
    ]
  },
  {
    "heading": "3. Account e credenziali",
    "paragraphs": [
      "L’utente deve fornire informazioni corrette, proteggere le credenziali e segnalare usi non autorizzati. Non deve impersonare altri o accedere ad account altrui."
    ]
  },
  {
    "heading": "4. Eventi e informazioni di terzi",
    "paragraphs": [
      "Informazioni su eventi, prezzi, orari, disponibilità e luoghi possono provenire da organizzatori, locali e fonti terze e possono cambiare. Flode si impegna a correggere gli errori segnalati ma non garantisce che ogni informazione sia sempre aggiornata. Eventuali acquisti e prenotazioni su servizi esterni sono regolati dalle condizioni dei rispettivi operatori."
    ]
  },
  {
    "heading": "5. Contenuti degli utenti",
    "paragraphs": [
      "Chi pubblica messaggi o informazioni dichiara di avere il diritto di condividerli, di non violare diritti altrui e di rispettare le regole della Community. L’utente mantiene i diritti sui propri contenuti e concede a Flode una licenza non esclusiva, limitata e gratuita per ospitarli, riprodurli e mostrarli nell’ambito del servizio e per il tempo necessario a gestirlo, nei limiti di legge."
    ]
  },
  {
    "heading": "6. Comportamenti vietati",
    "paragraphs": [
      "Sono vietati minacce, molestie, incitamento all’odio, spam, frodi, pubblicazione non autorizzata di dati personali, contenuti illegali, manipolazione del servizio e uso automatizzato abusivo."
    ]
  },
  {
    "heading": "7. Moderazione e segnalazioni",
    "paragraphs": [
      "Flode può ricevere segnalazioni, effettuare verifiche anche assistite da sistemi automatici, rimuovere contenuti o limitare account secondo criteri proporzionati e nel rispetto della normativa applicabile. [VERIFICARE: disponibilità effettiva di notifiche, motivazioni e contestazioni/ricorsi prima di prometterle]. Le segnalazioni non comportano automaticamente la rimozione."
    ]
  },
  {
    "heading": "8. Disponibilità e modifiche",
    "paragraphs": [
      "Il servizio può essere aggiornato, interrotto per manutenzione o modificato. Le modifiche sostanziali ai termini saranno comunicate con modalità adeguate prima della loro efficacia, ove richiesto."
    ]
  },
  {
    "heading": "9. Responsabilità",
    "paragraphs": [
      "Nulla in questi termini limita diritti inderogabili dei consumatori o esclude responsabilità che non possono essere escluse per legge. Nei limiti consentiti, Flode non risponde di disservizi imputabili a terzi o di informazioni inesatte fornite da organizzatori, senza pregiudicare i propri obblighi legali."
    ]
  },
  {
    "heading": "10. Cancellazione e contatti",
    "paragraphs": [
      "L’utente può chiedere chiusura account e gestione dei dati scrivendo a privacy@flodeapp.it, in attesa di un’eventuale funzione dedicata nell’app. [VERIFICARE implementazione e tempi]. Per segnalazioni relative ai contenuti utilizzare gli strumenti disponibili nell’app oppure lo stesso recapito."
    ]
  },
  {
    "heading": "11. Legge e controversie",
    "paragraphs": [
      "Si applica la normativa italiana, ferme le tutele inderogabili previste per i consumatori e le norme internazionalprivatistiche applicabili. [VERIFICARE informazioni obbligatorie del prestatore e eventuali obblighi DSA].",
      "Contatto: privacy@flodeapp.it  |  https://flodeapp.it"
    ]
  }
];

export function TermsOfService(props: LegalPageProps) {
  return <LegalLayout title="Termini e condizioni" sections={sections} {...props} />;
}