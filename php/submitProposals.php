<?php
include 'db.php'; // Include your database connection file

// Retrieve data from POST request
$student_unique_id = $_POST['student_unique_id'] ?? '';
$topic_id = $_POST['topic_id'] ?? '';
$proposal_text = $_POST['proposal_text'] ?? '';

// Validate input data
if (empty($student_unique_id) || empty($topic_id) || empty($proposal_text)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

// Check if the student already has more than 3 pending proposals
$pendingQuery = "SELECT COUNT(*) as pending_count FROM proposals WHERE student_unique_id = $1 AND status = 'pending'";
$pendingResult = pg_query_params($connection, $pendingQuery, [$student_unique_id]);
$pendingRow = pg_fetch_assoc($pendingResult);

if ($pendingRow['pending_count'] >= 3) {
    echo json_encode(['status' => 'error', 'message' => 'You already have 3 pending project proposals']);
    exit;
}

// Check if the student already has an accepted proposal
$acceptedQuery = "SELECT COUNT(*) as accepted_count FROM proposals WHERE student_unique_id = $1 AND status = 'accepted'";
$acceptedResult = pg_query_params($connection, $acceptedQuery, [$student_unique_id]);
$acceptedRow = pg_fetch_assoc($acceptedResult);

if ($acceptedRow['accepted_count'] > 0) {
    echo json_encode(['status' => 'error', 'message' => 'You already have already been assigned a project']);
    exit;
}

// Fetch supervisor unique ID from student_supervisor table
$supervisorQuery = "SELECT supervisor_unique_id FROM student_supervisor WHERE student_unique_id = $1";
$supervisorResult = pg_query_params($connection, $supervisorQuery, [$student_unique_id]);

if (!$supervisorResult) {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch supervisor unique ID', 'error' => $error]);
    exit;
}

$supervisorRow = pg_fetch_assoc($supervisorResult);
$supervisor_unique_id = $supervisorRow['supervisor_unique_id'] ?? '';

if (empty($supervisor_unique_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Supervisor unique ID not found']);
    exit;
}

// Status should always be "pending"
$status = 'pending';

// Prepare SQL query to insert data into proposals table
$insertQuery = "INSERT INTO proposals (student_unique_id, supervisor_unique_id, topic_id, proposal_text, status) VALUES ($1, $2, $3, $4, $5)";
$insertResult = pg_query_params($connection, $insertQuery, [$student_unique_id, $supervisor_unique_id, $topic_id, $proposal_text, $status]);

// Check query result
if ($insertResult) {
    echo json_encode(['status' => 'success', 'message' => 'Proposal submitted successfully']);
} else {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to submit proposal', 'error' => $error]);
}
?>
