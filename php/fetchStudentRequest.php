<?php
include 'db.php'; // Include your database connection file

// Retrieve the supervisor unique ID from POST request
$supervisor_unique_id = $_POST['supervisor_unique_id'] ?? '';

// Validate input data
if (empty($supervisor_unique_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Supervisor unique ID is required']);
    exit;
}

// Fetch student unique IDs with pending status from student_supervisor table
$studentQuery = "SELECT student_unique_id FROM student_supervisor WHERE supervisor_unique_id = $1 AND status = 'pending'";
$studentResult = pg_query_params($connection, $studentQuery, [$supervisor_unique_id]);

if (!$studentResult) {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch student unique IDs', 'error' => $error]);
    exit;
}

$students = [];
while ($studentRow = pg_fetch_assoc($studentResult)) {
    $student_unique_id = $studentRow['student_unique_id'];

    // Fetch student name from users table
    $userQuery = "SELECT name FROM users WHERE unique_id = $1";
    $userResult = pg_query_params($connection, $userQuery, [$student_unique_id]);

    if ($userResult && pg_num_rows($userResult) > 0) {
        $userRow = pg_fetch_assoc($userResult);
        $student_name = $userRow['name'];

        // Append the student details to the students array
        $students[] = [
            'student_name' => $student_name,
            'student_unique_id' => $student_unique_id
        ];
    }
}

// Send the students array back to the frontend
echo json_encode(['status' => 'success', 'students' => $students]);
