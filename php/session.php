<?php

session_start();
if ((isset($_POST['var']))&&(isset($_SESSION[$_POST['var']]))) {
   echo json_encode($_SESSION[$_POST['var']]);
}