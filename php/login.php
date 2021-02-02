<?php

session_start();

$username = isset($_POST['username']) ? $_POST['username'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$loginData = array(
    "username" => $username,
    "password" => $password,
);

spl_autoload_register(function($className) {
    require_once("../php/$className.php");
});

// check if user is valid with valid password
$loggedUser = AuthenticateController::login($loginData);
$loginSuccessful = $loggedUser !== null;
$response['success'] = false;

if ($loginSuccessful) {
    $_SESSION['username'] = $loggedUser['username'];
    $_SESSION['role'] = $loggedUser['role'];
    $_SESSION['root_node_id'] = $loggedUser['root_node_id'];
    $response['success'] = true;
    http_response_code(200);
    echo json_encode($response);
} else {
    http_response_code(400);
    $response['errors'] = ['reason' => 'Wrong credentials'];
    echo json_encode($response);
}