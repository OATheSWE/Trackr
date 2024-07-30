<?php
include 'db.php';
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function generateUniqueId($prefix) {
    $uniqueId = $prefix . str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    return $uniqueId;
}

function sendEmail($recipient, $subject, $body) {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->SMTPDebug = 0;                                       // Disable verbose debug output
        $mail->isSMTP();                                            // Set mailer to use SMTP
        $mail->Host       = 'smtp.gmail.com';                       // Specify main and backup SMTP servers
        $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
        $mail->Username   = 'osborneosas12@gmail.com';              // SMTP username
        $mail->Password   = 'zniw wylx awcx yfhg';                  // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption
        $mail->Port       = 587;                                    // TCP port to connect to

        // Recipients
        $mail->setFrom('osborneosas12@gmail.com', 'Trackr');
        $mail->addAddress($recipient);                              // Add a recipient

        // Content
        $mail->isHTML(true);                                        // Set email format to HTML
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->AltBody = strip_tags($body);

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}

// Retrieve POST data
$name = $_POST['name'] ?? '';
$department = $_POST['department'] ?? '';
$email = $_POST['email'] ?? '';
$userType = $_POST['userType'] ?? '';

// Validate user type
if ($userType !== 'student' && $userType !== 'supervisor') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid user type.']);
    exit;
}

// Generate unique ID based on user type
$uniqueId = ($userType === 'student') ? generateUniqueId('ST') : generateUniqueId('SP');

// Insert data into the database
$query = "INSERT INTO users (name, department, email, user_type, unique_id) VALUES ($1, $2, $3, $4, $5)";
$result = pg_query_params($connection, $query, [$name, $department, $email, $userType, $uniqueId]);

if ($result) {
    // Prepare email content
    $subject = 'Trackr Unique ID';
    $body = "Hello $name,<br><br>Your unique ID is: <strong>$uniqueId</strong><br><br>Thank you for signing up.";

    // Send email
    if (sendEmail($email, $subject, $body)) {
        echo json_encode(['status' => 'success', 'message' => 'Sign up successful. Check mail for Unique ID.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Sign up successful but email could not be sent.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to sign up.']);
}

pg_close($connection);
?>
