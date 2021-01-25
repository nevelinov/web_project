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

$isStudent = $_SESSION['role'] == 'student';
if (!$isStudent) {
    http_response_code(401);
    echo json_encode(['errors' => 'За да поставяте оценка трябва да сте студент.'], JSON_UNESCAPED_UNICODE);
    return;
}

$estimationCtrl = new EstimationController();

switch ($_SERVER['REQUEST_METHOD']) {
    
    case 'GET': {
        $response['success'] = true;
        
        $response['estimations'] = $estimationCtrl->getAllEstimations();
        http_response_code(200);
        echo json_encode($response);
        break;
    }

    case 'POST': {

        $estimationRequest = new EstimationRequest($_POST);
        $response['success'] = false;
        
        try {
            $estimationRequest->validate();
        } catch (RequestValidationException $e) {
            http_response_code(400);
            $response['errors'] = $e->getErrors();
            echo json_encode($response);
            return;
        }
        
        $added = $estimationCtrl->createEstimation($estimationRequest);
        $response['success'] = $added;
        
        if (!$added) {
            http_response_code(400);
            $response['errors'] = [
                'reason' => 'There is a problem with the estimation.'
            ];
        } else {
            http_response_code(201);
        }

        echo json_encode($response);
        
        break;
    }
}
