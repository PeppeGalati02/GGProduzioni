# Collegare le recensioni Google

La sezione è già predisposta. Finché la scheda Google non è verificata e le variabili Cloudflare non sono impostate, mostra soltanto lo stato di attesa e non richiede dati a Google.

## Attivazione dopo la verifica

1. Completa la verifica del Profilo dell’attività Google.
2. Dal profilo verificato, copia l’ID luogo (Place ID) e il link ufficiale “Chiedi recensioni”.
3. Prima di attivare Places API, pubblica una pagina **Termini di utilizzo** accessibile dal sito, che incorpori i termini Google Maps Platform applicabili; la sola informativa privacy non basta. Inserisci anche i link ai termini applicabili e all’informativa Google richiesta dalla policy.
4. In Google Cloud abilita Places API (New), attiva la fatturazione e crea una chiave API. Limita la chiave alla sola Places API; non inserirla nei file pubblici del sito. Imposta una quota giornaliera prudente per proteggere il progetto da richieste indesiderate.
5. In Cloudflare vai su **Workers & Pages → progetto Pages → Settings → Variables and Secrets** e imposta nell’ambiente **Production**:
   - `GOOGLE_PLACE_ID` — Place ID pubblico della scheda.
   - `GOOGLE_REVIEW_URL` — URL ufficiale per lasciare una recensione.
   - `GOOGLE_PLACES_API_KEY` — chiave API, salvata come secret cifrato.
6. Avvia un nuovo deploy Pages perché la Function possa usare le variabili.

Da quel momento `/api/google-reviews` legge valutazione, conteggio e fino a cinque recensioni direttamente da Places API. La home richiede i dati quando la sezione entra in vista e solo dopo il consenso a **Contenuti esterni — YouTube e Google Maps**. Non conserva i contenuti Google; gli autori e i link alla fonte restano visibili. Il sito si aggiorna quando il visitatore ricarica/apre la pagina, secondo la disponibilità e i tempi di aggiornamento di Google.

Riferimenti: [Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/place-details), [policy e attribuzioni Places](https://developers.google.com/maps/documentation/places/web-service/policies), [variabili e secret Cloudflare Pages](https://developers.cloudflare.com/pages/functions/bindings/).
