<?php
include 'db.php'; // Include your database connection file

// Retrieve the student unique ID from POST request
$student_unique_id = $_POST['student_unique_id'] ?? '';

// Check if file is uploaded
if (!isset($_FILES['project_file']) || $_FILES['project_file']['error'] != UPLOAD_ERR_OK) {
    echo json_encode(['status' => 'error', 'message' => 'Project file is required']);
    exit;
}

// Validate input data
if (empty($student_unique_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Student unique ID is required']);
    exit;
}

// Check if the student has already submitted a project
$checkQuery = "SELECT * FROM project_uploads WHERE student_unique_id = $1";
$checkResult = pg_query_params($connection, $checkQuery, [$student_unique_id]);

if (pg_num_rows($checkResult) > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Student has already submitted a project']);
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

// Handle the file upload
$uploadDir = 'uploads/'; // Directory to store uploaded files
$fileName = basename($_FILES['project_file']['name']);
$targetFilePath = $uploadDir . $fileName;

// Create the uploads directory if it doesn't exist
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Move the uploaded file to the target directory
if (move_uploaded_file($_FILES['project_file']['tmp_name'], $targetFilePath)) {
    // Prepare SQL query to insert the project upload details
    $insertQuery = "INSERT INTO project_uploads (student_unique_id, supervisor_unique_id, file_path) VALUES ($1, $2, $3)";
    $result = pg_query_params($connection, $insertQuery, [$student_unique_id, $supervisor_unique_id, $targetFilePath]);

    // Check query result
    if ($result) {
        echo json_encode(['status' => 'success', 'message' => 'Project uploaded successfully']);
    } else {
        $error = pg_last_error($connection);
        echo json_encode(['status' => 'error', 'message' => 'Failed to upload project', 'error' => $error]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to move uploaded file']);
}
