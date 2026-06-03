<?php

//BACKEND

//indico che la risposta è in JSON e le richieste CORS(meccanismo di sicurezza)
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

//creazione di un db statico di sport (array associativi)
$sport_db = [
    ["id" => 1, "nome" => "Calcio", "tipo" => "Squadra", "anno_invenzione" => 1863],
    ["id" => 2, "nome" => "Pallacanestro", "tipo" => "Squadra", "anno_invenzione" => 1891],
    ["id" => 3, "nome" => "Tennis", "tipo" => "Individuale", "anno_invenzione" => 1873],
    ["id" => 4, "nome" => "Pallavolo", "tipo" => "Squadra", "anno_invenzione" => 1895],
    ["id" => 5, "nome" => "Padel", "tipo" => "Coppia", "anno_invenzione" => 1969],
    ["id" => 6, "nome" => "Snowboard", "tipo" => "Individuale", "anno_invenzione" => 1965]
];

//variabile che prende la parte dell'URL dopo lo script e se non c'è nulla il valore è tutti 
$percorso = $_SERVER['PATH_INFO'] ?? '/tutti';

//avvia l'instradamento e decide quale parte di codice eseguire in base al percorso
switch($percorso) {
    case '/tutti':
        //trasforma l'array in una stringa JSON e la stampa
        echo json_encode($sport_db);
        break;

    case '/squadra':
        //filtro solo gli sport di squadra con array_filter e riordino gli indici con array_values
        $filtrati = array_values(array_filter($sport_db, function($s) {
            return strtolower($s['tipo']) === 'squadra';
        }));
        echo json_encode($filtrati);
        break;

    case '/moderni':
        //filtro solo gli sport inventati dal 1900 in poi
        $filtrati = array_values(array_filter($sport_db, function($s) {
            return $s['anno_invenzione'] >= 1900;
        }));
        echo json_encode($filtrati);
        break;

    default:
        //se l'URL non è tra quelli che ci sono, avviso il client che non è stata trovata la risorsa
        http_response_code(404);
        //messaggio di errore in JSON
        echo json_encode(["errore" => "Rotta '$percorso' non trovata. Cerca '/tutti', '/squadra' o '/moderni'."]);
        break;
}
?>