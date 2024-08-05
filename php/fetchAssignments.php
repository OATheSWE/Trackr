<?php
include 'db.php'; // Include your database connection file

// Retrieve student_unique_id from POST request
$student_unique_id = $_POST['student_unique_id'] ?? '';

// Validate input data
if (empty($student_unique_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Student unique ID is required']);
    exit;
}

// Fetch the department of the student from the users table
$departmentQuery = "SELECT department FROM users WHERE unique_id = $1";
$departmentResult = pg_query_params($connection, $departmentQuery, [$student_unique_id]);

if (!$departmentResult) {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch student department', 'error' => $error]);
    exit;
}

$departmentRow = pg_fetch_assoc($departmentResult);
$student_department = $departmentRow['department'] ?? '';

if (empty($student_department)) {
    echo json_encode(['status' => 'error', 'message' => 'Student department not found']);
    exit;
}

// Fetch topics from the topics table where topic_department matches student_department and assigned_to is not null
$topicsQuery = "SELECT * FROM topics WHERE topic_department = $1 AND assigned_to IS NOT NULL";
$topicsResult = pg_query_params($connection, $topicsQuery, [$student_department]);

if (!$topicsResult) {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch topics', 'error' => $error]);
    exit;
}

$assignments = [];
while ($topicRow = pg_fetch_assoc($topicsResult)) {
    $assigned_to = $topicRow['assigned_to'];
    $topic_name = $topicRow['topic_name'];

    // Fetch supervisor_unique_id from the student_supervisor table
    $supervisorQuery = "SELECT supervisor_unique_id FROM student_supervisor WHERE student_unique_id = $1";
    $supervisorResult = pg_query_params($connection, $supervisorQuery, [$assigned_to]);

    if (!$supervisorResult) {
        $error = pg_last_error($connection);
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch supervisor unique ID', 'error' => $error]);
        exit;
    }

    $supervisorRow = pg_fetch_assoc($supervisorResult);
    $supervisor_unique_id = $supervisorRow['supervisor_unique_id'] ?? '';

    // Fetch student and supervisor names from the users table
    $studentQuery = "SELECT name FROM users WHERE unique_id = $1";
    $studentResult = pg_query_params($connection, $studentQuery, [$assigned_to]);

    $supervisorQuery = "SELECT name FROM users WHERE unique_id = $1";
    $supervisorResult = pg_query_params($connection, $supervisorQuery, [$supervisor_unique_id]);

    if (!$studentResult || !$supervisorResult) {
        $error = pg_last_error($connection);
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch names', 'error' => $error]);
        exit;
    }

    $studentRow = pg_fetch_assoc($studentResult);
    $supervisorRow = pg_fetch_assoc($supervisorResult);

    $student_name = $studentRow['name'] ?? '';
    $supervisor_name = $supervisorRow['name'] ?? '';

    if (!empty($student_name) && !empty($supervisor_name)) {
        $assignments[] = [
            'student_name' => $student_name,
            'supervisor_name' => $supervisor_name,
            'topic_name' => $topic_name
        ];
    }
}

// Return the assignments array to the frontend
echo json_encode(['status' => 'success', 'assignments' => $assignments]);
?>
