<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

// Recuperiamo la rotta
$percorso = $_SERVER['PATH_INFO'] ?? '';
if (empty($percorso)) {
    $percorso = str_replace($_SERVER['SCRIPT_NAME'], '', $_SERVER['REQUEST_URI']);
}
$percorso = explode('?', $percorso)[0];

// IL GATEWAY GESTISCE I CASE (ROUTING)
switch ($percorso) {
    
    // CASO 1: Rotta pubblica (Login)
    case '/login':
        require 'api_utenti.php';
        break;

    // CASI 2, 3, 4: Rotte protette per il catalogo sport
    case '/tutti':
    case '/squadra':
    case '/moderni':
        
        // Prima di servire gli sport, il Gateway verifica il Token
        $headers = getallheaders();
        $auth_header = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if ($auth_header !== "Bearer token-segreto-5A") {
            http_response_code(401);
            echo json_encode(["errore" => "Accesso negato dal Gateway. Token non valido o assente."]);
            exit;
        }

        // Se il token è valido, passa il controllo al microservizio sport
        require 'api_sport.php';
        break;

    // CASO DEFAULT: Rotta non esistente
    default:
        http_response_code(404);
        echo json_encode(["errore" => "Rotta '$percorso' non gestita dall'API Gateway."]);
        break;
}
?>
