import { LegalLayout, type LegalPageProps } from   './LegalLayout';

const sections = [
  {
    "heading": "1. Scopo",
    "paragraphs": [
      "Le chat degli eventi Flode servono a condividere informazioni pertinenti, incontrare persone interessate agli stessi eventi e mantenere conversazioni rispettose."
    ]
  },
  {
    "heading": "2. Regole di comportamento",
    "paragraphs": [
      "Sono vietati molestie, minacce, insulti discriminatori, istigazione alla violenza, truffe, spam, promozione non autorizzata, contenuti illegali e pubblicazione di dati personali altrui senza titolo. Evita informazioni sensibili e dati che permettano di localizzare una persona."
    ]
  },
  {
    "heading": "3. Contenuti pertinenti",
    "paragraphs": [
      "Pubblica messaggi legati all’evento o alla partecipazione; non impersonare organizzatori o altri utenti; non diffondere notizie false in modo ingannevole."
    ]
  },
  {
    "heading": "4. Segnalazioni",
    "paragraphs": [
      "È possibile segnalare messaggi attraverso la funzione dedicata. La segnalazione deve essere effettuata in buona fede. Il team di moderazione valuta il contenuto e il contesto; non tutte le segnalazioni portano a una rimozione."
    ]
  },
  {
    "heading": "5. Moderazione AI e umana",
    "paragraphs": [
      "Un sistema automatico può evidenziare messaggi potenzialmente problematici. L’esito è soggetto a revisione umana prima di eventuali misure significative, secondo il funzionamento attuale da verificare. L’automazione non deve essere descritta come garanzia di rilevazione di tutti gli abusi."
    ]
  },
  {
    "heading": "6. Misure possibili",
    "paragraphs": [
      "In funzione della gravità e della ripetizione: avviso, rimozione del messaggio, limitazione temporanea o sospensione dell’account, se tecnicamente implementate. [VERIFICARE misure realmente disponibili]."
    ]
  },
  {
    "heading": "7. Contestazioni e contatto",
    "paragraphs": [
      "Per chiedere una revisione di una decisione di moderazione scrivere a privacy@flodeapp.it indicando il contesto senza inviare dati non necessari. [DEFINIRE un canale specifico per le contestazioni e verificare gli obblighi DSA applicabili]."
    ]
  },
  {
    "heading": "8. Sicurezza personale",
    "paragraphs": [
      "Non condividere documenti, password, indirizzi privati o dati bancari. Per minacce immediate contatta i servizi di emergenza; Flode non è un servizio di emergenza."
    ]
  },
  {
    "heading": "9. Conservazione e cancellazione",
    "paragraphs": [
      "I messaggi e le segnalazioni sono trattati secondo la Privacy Policy. [DEFINIRE e IMPLEMENTARE i tempi effettivi di conservazione, inclusa la gestione dei contenuti segnalati].",
      "Contatto: privacy@flodeapp.it  |  https://flodeapp.it"
    ]
  }
];

export function CommunityGuidelines(props: LegalPageProps) {
  return <LegalLayout title="Regolamento Community" sections={sections} {...props} />;
}