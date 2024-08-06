<?php
include 'db.php'; // Include your database connection file

// Retrieve data from POST request
$student_unique_id = $_POST['student_unique_id'] ?? '';
$status = $_POST['status'] ?? '';

// Validate input data
if (empty($student_unique_id) || empty($status)) {
    echo json_encode(['status' => 'error', 'message' => 'Student unique ID and status are required']);
    exit;
}

// Prepare SQL query to update the status in the student_supervisor table
$updateQuery = "UPDATE student_supervisor SET status = $1 WHERE student_unique_id = $2";
$updateResult = pg_query_params($connection, $updateQuery, [$status, $student_unique_id]);

// Check query result
if ($updateResult) {
    echo json_encode(['status' => 'success', 'message' => 'Status updated successfully']);
} else {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to update status', 'error' => $error]);
}
?>
