<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

if (isset($_SERVER['PATH_INFO'])) {
    $percorso = $_SERVER['PATH_INFO'];
} else {
    $percorso = '/tutti';
}

// 1. Rotta Pubblica: Login
if ($percorso === '/login') {
    require 'api_utenti.php';
    exit;
}

// 2. Rotte Protette: Controllo del Token
$headers = getallheaders();
$auth_header = "";
if (isset($headers['Authorization'])) {
    $auth_header = $headers['Authorization'];
} else if (isset($headers['authorization'])) {
    $auth_header = $headers['authorization'];
}

// Se il token manca o è sbagliato, blocco la richiesta
if ($auth_header !== "Bearer token-segreto-5A") {
    http_response_code(401);
    echo json_encode(["errore" => "Accesso negato dal Gateway. Fai il login."]);
    exit;
}

// 3. Se il token è corretto, includo il TUO api.php che farà il resto del lavoro
require 'api.php';
?>