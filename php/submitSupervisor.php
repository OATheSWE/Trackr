<?php
include 'db.php';

// Retrieve data from the request
$unique_id = $_POST['encrypted_unique_id'] ?? '';
$supervisor_unique_id = $_POST['supervisor_unique_id'] ?? '';

if (!$unique_id || !$supervisor_unique_id) {
    echo json_encode(['status' => 'error', 'message' => 'Student ID and Supervisor ID are required']);
    exit;
}

// Check if the student has already submitted a request
$checkRequestQuery = "SELECT status FROM student_supervisor WHERE student_unique_id = $1";
$checkRequestResult = pg_query_params($connection, $checkRequestQuery, [$unique_id]);

if (pg_num_rows($checkRequestResult) > 0) {
    $requestRow = pg_fetch_assoc($checkRequestResult);
    $currentStatus = $requestRow['status'];

    if ($currentStatus === 'pending') {
        echo json_encode(['status' => 'error', 'message' => 'You have already submitted a request.']);
        exit;
    }

   
}

// Insert or update the supervisor request
$insertRequestQuery = "
    INSERT INTO student_supervisor (student_unique_id, supervisor_unique_id, status)
    VALUES ($1, $2, 'pending')
    ON CONFLICT (student_unique_id)
    DO UPDATE SET supervisor_unique_id = EXCLUDED.supervisor_unique_id, status = 'pending'
";
$insertRequestResult = pg_query_params($connection, $insertRequestQuery, [$unique_id, $supervisor_unique_id]);

if ($insertRequestResult) {
    echo json_encode(['status' => 'success', 'message' => 'Supervisor request submitted successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to submit supervisor request.']);
}
