let paginaAttuale = 1;
let rottaAttuale = 'tutti';
let sessionToken = null; // Aggiunto: Variabile per salvare il token

// AGGIUNTO: Funzione per fare il login e prendere il token
async function eseguiLogin() {
    const userBox = document.getElementById('username').value;
    const passBox = document.getElementById('password').value;

    const risposta = await fetch(`gateway.php/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userBox, password: passBox })
    });
    
    const dati = await risposta.json();
    if (risposta.ok) {
        sessionToken = dati.token;
        alert("Login effettuato! Ora puoi caricare gli sport.");
    } else {
        alert("Errore: " + dati.errore);
    }
}

// LA TUA FUNZIONE ORIGINALE (Modificata solo per usare il gateway e il token)
async function caricaDati(rotta, nuovaPagina = 1) {
    rottaAttuale = rotta;
    paginaAttuale = nuovaPagina;

    const controlli = document.getElementById('controlli');
    const controlliPagine = document.getElementById('controlli-pagine');
    
    controlli.innerHTML = "<div class='col-12 text-center text-muted'><em>Interrogando il controller...</em></div>";
    controlliPagine.style.display = "none";

    try {
        // MODIFICA: Ora chiamiamo gateway.php invece di api.php
        let url = `gateway.php/${rotta}`;
        if (rotta === 'tutti') {
            url += `?pagina=${paginaAttuale}`;
        }

        // MODIFICA: Aggiunto l'invio del token nell'header Authorization
        const risposta = await fetch(url, {
            headers: { 'Authorization': 'Bearer ' + sessionToken }
        });
        
        const json = await risposta.json();

        if (!risposta.ok || json.errore) {
            let messaggioErrore = 'Errore generico';
            if (json.errore) {
                messaggioErrore = json.errore;
            }
            controlli.innerHTML = `<div class="col-12 text-center text-danger fw-bold">${messaggioErrore}</div>`;
            return;
        }

        let elencoSport = [];
        
        if (json.metadati) {
            elencoSport = json.dati;
            const meta = json.metadati;

            controlli.innerHTML = `<h3 class="col-12 text-center mb-4">Risultati per: /${rotta} <br><small class="text-muted fs-6">Pagina ${meta.pagina_corrente} di ${meta.totale_pagine}</small></h3>`;
            
            let statoBottonePrecedente = "";
            if (meta.pagina_corrente === 1) {
                statoBottonePrecedente = "disabled";
            }

            let statoBottoneSuccessivo = "";
            if (meta.pagina_corrente === meta.totale_pagine) {
                statoBottoneSuccessivo = "disabled";
            }

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
            elencoSport = json; 
            controlli.innerHTML = `<h3 class="col-12 text-center mb-4">Risultati per: /${rotta}</h3>`;
        }

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
        controlli.innerHTML = "<b style='color:red;'>Errore nella chiamata al Web Service.</b>";
        console.error(err);
    }
}