<?php
include 'db.php';

// Retrieve POST data
$uniqueId = $_POST['uniqueId'] ?? '';

// Validate input data
if (empty($uniqueId)) {
    echo json_encode(['status' => 'error', 'message' => 'Unique ID is required']);
    exit;
}

// Query to check if the unique ID exists
$query = "SELECT user_type FROM users WHERE unique_id = $1";
$result = pg_query_params($connection, $query, [$uniqueId]);

if ($result) {
    $row = pg_fetch_assoc($result);
    
    if ($row) {
        // Determine the redirect URL based on user type
        $userType = $row['user_type'];
        $redirectUrl = ($userType === 'student') ? '/student/supervisors' : '/supervisor/students';

        // Respond with success and redirect URL
        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful.',
            'link' => $redirectUrl,
            'user_type' => $userType,
        ]);
    } else {
        // Unique ID not found
        echo json_encode(['status' => 'error', 'message' => 'Invalid Unique ID.']);
    }
} else {
    // Query failed
    echo json_encode(['status' => 'error', 'message' => 'Failed to perform login check.']);
}

// Close the database connection
pg_close($connection);
?>
