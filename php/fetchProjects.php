<?php
include 'db.php'; // Include your database connection file

// Retrieve student unique ID from POST request
$student_unique_id = $_POST['student_unique_id'] ?? '';

// Validate student unique ID
if (empty($student_unique_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Student unique ID is required']);
    exit;
}

// Fetch student department from users table
$departmentQuery = "SELECT department FROM users WHERE unique_id = $1";
$departmentResult = pg_query_params($connection, $departmentQuery, [$student_unique_id]);

if (!$departmentResult) {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch student department', 'error' => $error]);
    exit;
}

$departmentRow = pg_fetch_assoc($departmentResult);
$department = $departmentRow['department'] ?? '';

// Fetch all topics from topics table
$topicsQuery = "SELECT * FROM topics";
$topicsResult = pg_query($connection, $topicsQuery);

if (!$topicsResult) {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch topics', 'error' => $error]);
    exit;
}

$topics = [];
while ($topicRow = pg_fetch_assoc($topicsResult)) {
    // Filter topics by department and assignment status
    if ($topicRow['topic_department'] === $department && empty($topicRow['assigned_to'])) {
        $topics[] = $topicRow;
    }
}

// Return filtered topics as JSON response
echo json_encode(['status' => 'success', 'projects' => $topics]);
