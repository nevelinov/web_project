<?php

session_start();

$logged = isset($_SESSION['username']);
$role = $logged ? $_SESSION['role'] : '';

echo json_encode(['logged' => $logged, 'role' => $role]);