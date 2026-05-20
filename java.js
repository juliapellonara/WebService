//funzione asincrona che riceve i dati dal bottone dell'HTML
async function caricaDati(rotta) {
    //prende il div con id controlli e lo usa come contenitore per mettere i risultati
    const controlli = document.getElementById('controlli');
    //messaggio di caricamento
    controlli.innerHTML = "<em>Interrogando il controller...</em>";

    try {
        //costruzione dell'URL insieme la rotta
        const url = `api.php/${rotta}`;
        //chiamata HTTP e aspetta risposta dal server
        const risposta = await fetch(url);
        //prende la risposta grezza del server e aspetta di trasformarla in JSON
        const dati = await risposta.json();

        controlli.innerHTML = `<h3>Risultati per: /${rotta}</h3>`;
        
        //prende i dati ricevuti e parte un ciclo
        dati.forEach(sport => {
            controlli.innerHTML += `
                <div class="col-12 mb-3">
                    <strong>${sport.nome}</srong> (${sport.anno_invenzione})<br>
                    <small>Tipo: ${sport.tipo}</small>
                </div>
            `;
        });
    } catch (err) {
        // Stampa l'errore nudo e crudo (es. scatta con il tasto Test Errore 404)
        controlli.innerHTML = "<b style='color:red;'>Errore nella chiamata al Web Service.</b>";
    }
}
