<?php
include 'db.php'; // Include your database connection file

// Retrieve the supervisor unique ID from POST request
$supervisor_unique_id = $_POST['supervisor_unique_id'] ?? '';

// Validate input data
if (empty($supervisor_unique_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Supervisor unique ID is required']);
    exit;
}

// Initialize the array to hold project uploads
$projectUploads = [];

// Fetch project uploads for the given supervisor unique ID
$uploadsQuery = "SELECT * FROM project_uploads WHERE supervisor_unique_id = $1";
$uploadsResult = pg_query_params($connection, $uploadsQuery, [$supervisor_unique_id]);

if (!$uploadsResult) {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch project uploads', 'error' => $error]);
    exit;
}

// Process each row from the project uploads result
while ($uploadRow = pg_fetch_assoc($uploadsResult)) {
    $student_unique_id = $uploadRow['student_unique_id'];
    $file_link = $uploadRow['file_link'];

    // Fetch student name from the users table
    $studentQuery = "SELECT name FROM users WHERE unique_id = $1";
    $studentResult = pg_query_params($connection, $studentQuery, [$student_unique_id]);

    if (!$studentResult) {
        $error = pg_last_error($connection);
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch student name', 'error' => $error]);
        exit;
    }

    $studentRow = pg_fetch_assoc($studentResult);
    $student_name = $studentRow['name'] ?? '';

    // Fetch topic name from the topics table
    $topicQuery = "SELECT topic_name FROM topics WHERE assigned_to = $1";
    $topicResult = pg_query_params($connection, $topicQuery, [$student_unique_id]);

    if (!$topicResult) {
        $error = pg_last_error($connection);
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch topic name', 'error' => $error]);
        exit;
    }

    $topicRow = pg_fetch_assoc($topicResult);
    $topic_name = $topicRow['topic_name'] ?? '';

    // Append to the project uploads array
    $projectUploads[] = [
        'student_name' => $student_name,
        'topic_name' => $topic_name,
        'file_link' => $file_link
    ];
}

// Send the project uploads array back to the frontend
echo json_encode(['status' => 'success', 'projectUploads' => $projectUploads]);
?>
