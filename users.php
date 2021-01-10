<?php

session_start();

spl_autoload_register(function($className) {
    require_once("./libs/$className.php");
});

$userCtrl = new UserController();

switch ($_SERVER['REQUEST_METHOD']) {
    
    case 'GET': {
        $logged = isset($_SESSION['username']);

        if ($logged) {
            echo json_encode($userCtrl->getAllUsers(), JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(['error' => 'За да видите този ресурс трябва да сте влезли в системата.'], JSON_UNESCAPED_UNICODE);
        }
        break;
    }

    case 'POST': {

        $userRegisterRequest = new NewUserRequest($_POST);

        try {
            $userRegisterRequest->validate();
        } catch (RequestValidationException $e) {
            die(json_encode($e->getErrors()));
        }

        $added = $userCtrl->registerUser($userRegisterRequest);

        echo json_encode(['success' => $added]);

        break;
    }
}
