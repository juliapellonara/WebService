let paginaAttuale = 1;
let rottaAttuale = 'tutti';

//funzione asincrona che riceve i dati dal bottone dell'HTML 
async function caricaDati(rotta, nuovaPagina = 1) {
    rottaAttuale = rotta;
    paginaAttuale = nuovaPagina;

    //prende il div con id controlli e lo usa come contenitore per mettere i risultati 
    const controlli = document.getElementById('controlli');
    const controlliPagine = document.getElementById('controlli-pagine');
    
    //messaggio di caricamento 
    controlli.innerHTML = "<div class='col-12 text-center text-muted'><em>Interrogando il controller...</em></div>";
    
    // Nascondiamo preventivamente i controlli di paginazione ad ogni nuovo click
    controlliPagine.style.display = "none";

    try {
        //costruzione dell'URL insieme la rotta 
        let url = `api.php/${rotta}`;
        // Se stiamo chiamando "tutti", aggiungiamo il parametro della pagina all'URL
        if (rotta === 'tutti') {
            url += `?pagina=${paginaAttuale}`;
        }

        //chiamata HTTP e aspetta risposta dal server 
        const risposta = await fetch(url);
        //prende la risposta grezza del server e aspetta di trasformarla in JSON 
        const json = await risposta.json();

        // Se scatta un errore lato server (es. 404)
        if (!risposta.ok || json.errore) {
            let messaggioErrore = 'Errore generico';
            if (json.errore) {
                messaggioErrore = json.errore;
            }
            controlli.innerHTML = `<div class="col-12 text-center text-danger fw-bold">${messaggioErrore}</div>`;
            return;
        }

        // --- GESTIONE DATI CON E SENZA PAGINAZIONE ---
        let elencoSport = [];
        
        if (json.metadati) {
            // ROTTA PAGINATA (/tutti)
            elencoSport = json.dati;
            const meta = json.metadati;

            controlli.innerHTML = `<h3 class="col-12 text-center mb-4">Risultati per: /${rotta} <br><small class="text-muted fs-6">Pagina ${meta.pagina_corrente} di ${meta.totale_pagine}</small></h3>`;
            
            // Logica disabilitazione bottoni con IF classici
            let statoBottonePrecedente = "";
            if (meta.pagina_corrente === 1) {
                statoBottonePrecedente = "disabled";
            }

            let statoBottoneSuccessivo = "";
            if (meta.pagina_corrente === meta.totale_pagine) {
                statoBottoneSuccessivo = "disabled";
            }

            // Genera i bottoni della paginazione
            controlliPagine.style.display = "flex";
            controlliPagine.classList.add("justify-content-between", "align-items-center");
            
            controlliPagine.innerHTML = `
                <div class="text-muted">Elementi totali: <b>${meta.totale_elementi}</b></div>
                <div>
                    <button class="btn btn-outline-secondary me-2" ${statoBottonePrecedente} onclick="caricaDati('${rotta}', ${meta.pagina_corrente - 1})">« Precedente</button>
                    <button class="btn btn-outline-secondary" ${statoBottoneSuccessivo} onclick="caricaDati('${rotta}', ${meta.pagina_corrente + 1})">Successiva »</button>
                </div>
            `;
        } else {
            // ROTTA SENZA PAGINAZIONE (/squadra o /moderni)
            elencoSport = json; 
            controlli.innerHTML = `<h3 class="col-12 text-center mb-4">Risultati per: /${rotta}</h3>`;
        }

        //prende i dati ricevuti e parte un ciclo 
        elencoSport.forEach(sport => {
            controlli.innerHTML += `
                <div class="col-12 col-md-6 mb-3">
                    <div class="p-3 bg-white border rounded shadow-sm" style="border-left: 5px solid #0d6efd !important;">
                        <strong>${sport.nome}</strong> (${sport.anno_invenzione})<br>
                        <small class="text-muted">Tipo: ${sport.tipo}</small>
                    </div>
                </div>
            `;
        });

    } catch (err) {
        // Stampa l'errore nudo e crudo (es. scatta con il tasto Test Errore 404) 
        controlli.innerHTML = "<b style='color:red;'>Errore nella chiamata al Web Service.</b>";
        console.error(err);
    }
}