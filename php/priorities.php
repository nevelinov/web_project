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

if ($_SESSION['role'] == 'student') {
    http_response_code(401);
    echo json_encode(['errors' => 'Нямате необходимите права за да достъпите този ресурс.'], JSON_UNESCAPED_UNICODE);
    return;
}

$estimationCtrl = new EstimationController();

$response['success'] = false;
$added = $estimationCtrl->setPriority($_POST['estimation_priority'], $_POST['se_id']);

if ($added) {
    http_response_code(200);
    $response['success'] = true;
} else {
    http_response_code(401);
    $response['success'] = false;
    $response['errors'] = 'There is problem setting the priority';
}

echo json_encode($response);

/*
$priorityCtrl = new PriorityController();

switch ($_SERVER['REQUEST_METHOD']) {
    
    case 'GET': {
        $response['success'] = true;
        $response['priorities'] = $priorityCtrl->getAllPrioritiesForStudentEstimation(intval($_GET['se_id']));
        http_response_code(200);
        echo json_encode($response);
        break;
    }

    case 'POST': {
        $newPriorityRequest = new PriorityRequest($_POST);
        $response['success'] = false;
        
        try {
            $newPriorityRequest->validate();
        } catch (RequestValidationException $e) {
            http_response_code(400);
            $response['errors'] = $e->getErrors();
            echo json_encode($response);
            return;
        }
        
        $added = $priorityCtrl->addPriority($newPriorityRequest);
        $response['success'] = $added;
    
        if (!$added) {
            http_response_code(400);
            $response['errors'] = [
                'reason' => 'There is problem creating the priority.'
            ];
        } else {
            http_response_code(201);
        }

        echo json_encode($response);
        
        break;
    }
}
*/