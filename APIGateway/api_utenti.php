<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dati = json_decode(file_get_contents("php://input"), true);
    
    $username = "";
    if (isset($dati['username'])) {
        $username = $dati['username'];
    }
    
    $password = "";
    if (isset($dati['password'])) {
        $password = $dati['password'];
    }

    // Se le credenziali sono corrette, rilasciamo il token
    if ($username === "admin" && $password === "password123") {
        http_response_code(200);
        echo json_encode(["token" => "token-segreto-5A"]);
    } else {
        http_response_code(401);
        echo json_encode(["errore" => "Credenziali errate."]);
    }
    exit;
}
?>