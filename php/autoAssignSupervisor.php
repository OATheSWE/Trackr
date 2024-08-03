<?php
include 'db.php';

// Fetch student unique ID from request
$student_unique_id = $_POST['encrypted_unique_id'] ?? '';

if (!$student_unique_id) {
    echo json_encode(['status' => 'error', 'message' => 'Student unique ID is required']);
    exit;
}

// Fetch available supervisors who are not at full capacity
$availableSupervisorsQuery = "SELECT unique_id FROM users WHERE user_type = 'supervisor' AND current_students < max_students LIMIT 1";
$availableSupervisorsResult = pg_query($connection, $availableSupervisorsQuery);

if (!$availableSupervisorsResult || pg_num_rows($availableSupervisorsResult) === 0) {
    echo json_encode(['status' => 'error', 'message' => 'No available supervisors']);
    exit;
}

$supervisorRow = pg_fetch_assoc($availableSupervisorsResult);
$supervisor_unique_id = $supervisorRow['unique_id'];

// Check if the student has already submitted a request
$checkRequestQuery = "SELECT status FROM student_supervisor WHERE student_unique_id = $1";
$checkRequestResult = pg_query_params($connection, $checkRequestQuery, [$student_unique_id]);

if (pg_num_rows($checkRequestResult) > 0) {
    $requestRow = pg_fetch_assoc($checkRequestResult);
    $currentStatus = $requestRow['status'];

    if ($currentStatus === 'pending') {
        echo json_encode(['status' => 'error', 'message' => 'You have already submitted a request.']);
        exit;
    }
    
}

// Update student_supervisor table with auto-assigned supervisor
$updateQuery = "INSERT INTO student_supervisor (student_unique_id, supervisor_unique_id, status)
    VALUES ($1, $2, 'accepted')
    ON CONFLICT (student_unique_id)
    DO UPDATE SET supervisor_unique_id = EXCLUDED.supervisor_unique_id, status = 'pending'";
$result = pg_query_params($connection, $updateQuery, [$student_unique_id, $supervisor_unique_id]);

if (!$result) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to auto-assign supervisor']);
    exit;
}

// Increment available slots for the selected supervisor
$updateSupervisorQuery = "UPDATE users SET current_students = current_students + 1 WHERE unique_id = $1";
pg_query_params($connection, $updateSupervisorQuery, [$supervisor_unique_id]);

echo json_encode(['status' => 'success', 'message' => 'Supervisor auto-assigned successfully']);
