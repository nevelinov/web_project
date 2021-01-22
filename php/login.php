<?php

session_start();

$username = isset($_POST['username']) ? $_POST['username'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$loginData = array(
    "username" => $username,
    "password" => $password,
);

spl_autoload_register(function($className) {
    require_once("./libs/$className.php");
});

// login request validation is optional

// check if user is valid with valid password
$loggedUser = AuthenticateController::login($loginData);
$loginSuccessful = $loggedUser !== null;

if ($loginSuccessful) {
    $_SESSION['username'] = $loggedUser['username'];
}

echo json_encode(['success' => $loginSuccessful]);