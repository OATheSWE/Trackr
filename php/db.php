<?php
// header('Access-Control-Allow-Origin: http://localhost:8081/');
// header('Access-Control-Allow-Origin: https://krowdkontrollers.com.ng');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
// header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, Accept, X-Requested-With");

// header('Access-Control-Allow-Origin: https://paystack.com/pay/krowdkontrollers');

$host = 'localhost';
$database = "Trackr";
$user = 'postgres';
$password = 'ogechi12';

// Establish connection
$connection = pg_connect("host=$host dbname=$database user=$user password=$password");

// Check connection
if (!$connection) {
    die("Connection failed: " . pg_last_error());
}

// Optional: Handle connection error using try-catch block for better error handling
/*
try {
    $connection = pg_connect("host=$host dbname=$database user=$user password=$password");
} catch (Exception $e) {
    die("Connection failed: " . $e->getMessage());
}
*/

?>
