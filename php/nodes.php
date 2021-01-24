<?php

session_start();

spl_autoload_register(function($className) {
    require_once("../php/$className.php");
});

$logged = isset($_SESSION['username']);
if (!$logged) {
    http_response_code(401);
    echo json_encode(['errors' => 'За да видите този ресурс трябва да сте влезли в системата.'], JSON_UNESCAPED_UNICODE);
    return;
}

$nodeCtrl = new NodeController();

switch ($_SERVER['REQUEST_METHOD']) {
    
    case 'GET': {
        $response['success'] = true;
        $response['nodes'] = $nodeCtrl->getAllNodes();
        http_response_code(200);
        echo json_encode($response);
        break;
    }

    case 'POST': {
        $nodeUpdateRequest = new NodeRequest($_POST);
        $response['success'] = false;
        
        try {
            $nodeUpdateRequest->validate();
        } catch (RequestValidationException $e) {
            http_response_code(400);
            $response['errors'] = $e->getErrors();
            echo json_encode($response);
            return;
        }
        
        $added = $nodeCtrl->addNode($nodeUpdateRequest);
        $response['success'] = $added;
    
        if (!$added) {
            http_response_code(400);
            $response['errors'] = [
                'reason' => 'There is probably node with that id.'
            ];
        } else {
            http_response_code(201);
        }

        echo json_encode($response);
        
        break;
    }
}
