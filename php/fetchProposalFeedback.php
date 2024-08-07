<?php
include 'db.php'; // Include your database connection file

// Retrieve the student unique ID from POST request
$student_unique_id = $_POST['student_unique_id'] ?? '';

// Validate input data
if (empty($student_unique_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Student unique ID is required']);
    exit;
}

// Fetch proposals for the given student unique ID
$proposalsQuery = "SELECT * FROM proposals WHERE student_unique_id = $1";
$proposalsResult = pg_query_params($connection, $proposalsQuery, [$student_unique_id]);

if (!$proposalsResult) {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch proposals', 'error' => $error]);
    exit;
}

$proposals = [];
while ($proposalRow = pg_fetch_assoc($proposalsResult)) {
    // Fetch feedback comment for each proposal
    $feedbackQuery = "SELECT comment FROM feedback WHERE proposal_id = $1";
    $feedbackResult = pg_query_params($connection, $feedbackQuery, [$proposalRow['proposal_id']]);

    $feedbackComment = '';
    if ($feedbackResult && pg_num_rows($feedbackResult) > 0) {
        $feedbackComment = pg_fetch_result($feedbackResult, 0, 'comment') ?? '';
    }

    // Fetch the topic name for each proposal using the topic_id
    $topicQuery = "SELECT topic_name FROM topics WHERE topic_id = $1";
    $topicResult = pg_query_params($connection, $topicQuery, [$proposalRow['topic_id']]);
    
    $topicName = '';
    if ($topicResult && pg_num_rows($topicResult) > 0) {
        $topicName = pg_fetch_result($topicResult, 0, 'topic_name') ?? '';
    }

    // Append the feedback comment and topic name to the proposal row
    $proposalRow['comment'] = $feedbackComment;
    $proposalRow['topic_name'] = $topicName;

    // Store the proposal row in the proposals array
    $proposals[] = $proposalRow;
}

// Send the proposals array back to the frontend
echo json_encode(['status' => 'success', 'proposals' => $proposals]);
?>
