<?php

session_start();

spl_autoload_register(function($className) {
    require_once("../php/$className.php");
});

$logged = isset($_SESSION['username']);
if (!$logged) {
    http_response_code(401);
    die(json_encode(['error' => 'За да видите този ресурс трябва да сте влезли в системата.'], JSON_UNESCAPED_UNICODE));
}

$userCtrl = new UserController();

switch ($_SERVER['REQUEST_METHOD']) {
    
    case 'GET': {
        echo json_encode($userCtrl->getAllUsers(), JSON_UNESCAPED_UNICODE);
        break;
    }

    case 'POST': {

        $userRegisterRequest = new NewUserRequest($_POST);
        $response = ['success' => false];

        try {
            $userRegisterRequest->validate();
        } catch (RequestValidationException $e) {
            http_response_code(400);
            $response['errors'] = $e->getErrors();
            echo json_encode($response);
            return;
        }

        $added = $userCtrl->registerUser($userRegisterRequest);
        $response['success'] = $added;
    
        if (!$added) {
            http_response_code(400);
            $response['errors'] = [
                'reason' => 'user already exists!'
            ];
        } else {
            http_response_code(201);
        }

        echo json_encode($response);

        break;
    }
}
