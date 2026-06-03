<?php
// Database statico degli sport
$sport_db = [
    ["id" => 1, "nome" => "Calcio", "tipo" => "Squadra", "anno_invenzione" => 1863],
    ["id" => 2, "nome" => "Pallacanestro", "tipo" => "Squadra", "anno_invenzione" => 1891],
    ["id" => 3, "nome" => "Tennis", "tipo" => "Individuale", "anno_invenzione" => 1873],
    ["id" => 4, "nome" => "Pallavolo", "tipo" => "Squadra", "anno_invenzione" => 1895],
    ["id" => 5, "nome" => "Padel", "tipo" => "Coppia", "anno_invenzione" => 1969],
    ["id" => 6, "nome" => "Snowboard", "tipo" => "Individuale", "anno_invenzione" => 1965]
];

$dati_risposta = [];

// Elaborazione dei dati in base alla rotta validata dal Gateway
if ($percorso === '/tutti') {
    $dati_risposta = $sport_db;
} 
elseif ($percorso === '/squadra') {
    $dati_risposta = array_values(array_filter($sport_db, function($s) {
        return strtolower($s['tipo']) === 'squadra';
    }));
} 
elseif ($percorso === '/moderni') {
    $dati_risposta = array_values(array_filter($sport_db, function($s) {
        return $s['anno_invenzione'] >= 1900;
    }));
}

// Risposta JSON generata dal microservizio
echo json_encode([
    "servizio_origine" => "Microservizio Sport",
    "data" => $dati_risposta
]);
?>
