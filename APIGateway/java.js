
        const GATEWAY_URL = 'gateway.php';
        
        // Questa variabile globale simulerà la sessione del browser
        let sessionToken = null;

        // 1. FUNZIONE DI LOGIN (Invia credenziali via POST)
        async function eseguiLogin() {
            const userBox = document.getElementById('username').value;
            const passBox = document.getElementById('password').value;
            const container = document.getElementById('container-tabella');

            try {
                const risposta = await fetch(`${GATEWAY_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: userBox, password: passBox })
                });

                const dati = await risposta.json();

                if (risposta.status === 200) {
                    sessionToken = dati.token;
                    
                    document.getElementById('stato-sessione').className = "status-badge status-connected";
                    document.getElementById('stato-sessione').innerText = `Autenticato come: ${dati.utente.username} (${dati.utente.ruolo})`;
                    document.getElementById('area-login').style.display = "none";
                    document.getElementById('btn-logout').style.display = "inline-block";
                    container.innerHTML = `<p style="color: green;"><b>${dati.messaggio}</b> Ora puoi richiedere gli sport.</p>`;
                } else {
                    container.innerHTML = `<div class="error-box"><b>Errore di Login:</b> ${dati.errore}</div>`;
                }
            } catch (err) {
                container.innerHTML = "<div class='error-box'>Impossibile contattare il servizio di autenticazione.</div>";
            }
        }

        // 2. RECUPERO RISORSA PROTETTA (Passa la rotta dinamicamente)
        async function richiediSport(rotta) {
            const container = document.getElementById('container-tabella');
            container.innerHTML = "<em>Interrogando il Gateway sicuro...</em>";

            try {
                // Aggiungiamo la rotta scelta al Gateway URL
                const risposta = await fetch(`${GATEWAY_URL}${rotta}`, {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${sessionToken}` 
                    }
                });
                
                const rispostaOggetto = await risposta.json(); 

                if (risposta.status === 200) {
                    const elencoSport = rispostaOggetto.data;       
                    
                    // Intestazione della tabella aggiornata per gli sport
                    let htmlTabella = `<p><small>Provenienza dei dati: <b>${rispostaOggetto.servizio_origine}</b></small></p>
                    <table class="api-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Tipologia</th>
                                <th>Anno Invenzione</th>
                            </tr>
                        </thead>
                        <tbody>`;

                    // Ciclo per creare le righe della tabella con i dati degli sport
                    elencoSport.forEach(sport => {
                        htmlTabella += `<tr>
                            <td><b>#${sport.id}</b></td>
                            <td>${sport.nome}</td>
                            <td>${sport.tipo}</td>
                            <td>${sport.anno_invenzione}</td>
                        </tr>`;
                    });

                    htmlTabella += `</tbody></table>`;
                    container.innerHTML = htmlTabella;
                } else {
                    // Errore generato dal Gateway se il token non c'è o è scaduto
                    container.innerHTML = `
                        <div class="error-box">
                            <h3>Errore HTTP ${risposta.status} (Non Autorizzato)</h3>
                            <p>${rispostaOggetto.errore}</p>
                        </div>
                    `;
                }

            } catch (err) {
                container.innerHTML = "<div class='error-box'>Errore di connessione con l'infrastruttura.</div>";
            }
        }

        // 3. LOGOUT (Svuota il token locale)
        function eseguiLogout() {
            sessionToken = null; // Distruggiamo il token
            document.getElementById('stato-sessione').className = "status-badge status-disconnected";
            document.getElementById('stato-sessione').innerText = "Non autenticato";
            document.getElementById('area-login').style.display = "block";
            document.getElementById('btn-logout').style.display = "none";
            document.getElementById('container-tabella').innerHTML = "<p>Sessione chiusa. Ti sei disconnesso correttamente.</p>";
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
        }
