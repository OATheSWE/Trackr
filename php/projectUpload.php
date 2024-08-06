<?php
include 'db.php'; // Include your database connection file

// Retrieve the student unique ID from POST request
$student_unique_id = $_POST['student_unique_id'] ?? '';
$file_link = $_POST['file_link'] ?? '';


// Validate input data
if (empty($student_unique_id) && empty($file_link)) {
    echo json_encode(['status' => 'error', 'message' => 'Student unique ID & File Link is required']);
    exit;
}

// Check if the student has already submitted a project
$checkQuery = "SELECT * FROM project_uploads WHERE student_unique_id = $1";
$checkResult = pg_query_params($connection, $checkQuery, [$student_unique_id]);

if (pg_num_rows($checkResult) > 0) {
    echo json_encode(['status' => 'error', 'message' => 'You have already submitted a project']);
    exit;
}

// Get the supervisor unique ID from the student_supervisor table
$supervisorQuery = "SELECT supervisor_unique_id FROM student_supervisor WHERE student_unique_id = $1";
$supervisorResult = pg_query_params($connection, $supervisorQuery, [$student_unique_id]);
$supervisorRow = pg_fetch_assoc($supervisorResult);
$supervisor_unique_id = $supervisorRow['supervisor_unique_id'] ?? '';

if (empty($supervisor_unique_id)) {
    echo json_encode(['status' => 'error', 'message' => 'No supervisor found for the student']);
    exit;
}

// Prepare SQL query to insert the project upload details
$insertQuery = "INSERT INTO project_uploads (student_unique_id, supervisor_unique_id, file_link) VALUES ($1, $2, $3)";
$result = pg_query_params($connection, $insertQuery, [$student_unique_id, $supervisor_unique_id, $file_link]);

// Check query result
if ($result) {
    echo json_encode(['status' => 'success', 'message' => 'Project uploaded successfully']);
} else {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to upload project', 'error' => $error]);
}