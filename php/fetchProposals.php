<?php
include 'db.php'; // Include your database connection file

// Retrieve the supervisor unique ID from POST request
$supervisor_unique_id = $_POST['supervisor_unique_id'] ?? '';

// Validate input data
if (empty($supervisor_unique_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Supervisor unique ID is required']);
    exit;
}

// Fetch student IDs with accepted proposals
$acceptedStudentsQuery = "SELECT DISTINCT student_unique_id FROM proposals WHERE status = 'accepted'";
$acceptedStudentsResult = pg_query($connection, $acceptedStudentsQuery);

if (!$acceptedStudentsResult) {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch accepted proposals', 'error' => $error]);
    exit;
}

$acceptedStudentIds = [];
while ($row = pg_fetch_assoc($acceptedStudentsResult)) {
    $acceptedStudentIds[] = $row['student_unique_id'];
}

// Fetch proposals for the given supervisor unique ID
$proposalsQuery = "SELECT * FROM proposals WHERE supervisor_unique_id = $1 and status = 'pending'";
$proposalsResult = pg_query_params($connection, $proposalsQuery, [$supervisor_unique_id]);

if (!$proposalsResult) {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch proposals', 'error' => $error]);
    exit;
}

$proposals = [];
while ($proposalRow = pg_fetch_assoc($proposalsResult)) {
    $student_unique_id = $proposalRow['student_unique_id'];
    
    // Skip proposals from students who already have an accepted proposal
    if (in_array($student_unique_id, $acceptedStudentIds)) {
        continue;
    }
    
    $topic_id = $proposalRow['topic_id'];

    // Fetch student name
    $studentQuery = "SELECT name, strengths FROM users WHERE unique_id = $1";
    $studentResult = pg_query_params($connection, $studentQuery, [$student_unique_id]);
    $studentRow = pg_fetch_assoc($studentResult);
    $student_name = $studentRow['name'] ?? '';
    $student_strengths = $studentRow['strengths'] ?? '';

    // Fetch topic name
    $topicQuery = "SELECT topic_name FROM topics WHERE topic_id = $1";
    $topicResult = pg_query_params($connection, $topicQuery, [$topic_id]);
    $topicRow = pg_fetch_assoc($topicResult);
    $topic_name = $topicRow['topic_name'] ?? '';

    // Append the fetched details to the proposal row
    $proposalRow['student_name'] = $student_name;
    $proposalRow['student_strengths'] = $student_strengths;
    $proposalRow['topic_name'] = $topic_name;

    // Only keep required fields
    $proposals[] = [
        'student_name' => $student_name,
        'student_strengths' => $student_strengths,
        'student_unique_id' => $student_unique_id,
        'topic_name' => $topic_name,
        'topic_id' => $topic_id,
        'proposal_text' => $proposalRow['proposal_text'],
        'proposal_id' => $proposalRow['proposal_id'],
    ];
}

// Send the proposals array back to the frontend
echo json_encode(['status' => 'success', 'proposals' => $proposals]);
?>
