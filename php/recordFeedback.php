<?php
include 'db.php'; // Include your database connection file

// Retrieve data from POST request
$proposal_id = $_POST['proposal_id'] ?? '';
$supervisor_unique_id = $_POST['supervisor_unique_id'] ?? '';
$student_unique_id = $_POST['student_unique_id'] ?? '';
$comment = $_POST['comment'] ?? '';
$status = $_POST['status'] ?? '';
$topic_id = $_POST['topic_id'] ?? '';

// Validate input data
if (empty($proposal_id) || empty($supervisor_unique_id) || empty($student_unique_id) || empty($comment) || empty($status) || empty($topic_id)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

// Insert feedback into the feedback table
$insertFeedbackQuery = "INSERT INTO feedback (proposal_id, supervisor_unique_id, comment) VALUES ($1, $2, $3)";
$insertFeedbackResult = pg_query_params($connection, $insertFeedbackQuery, [$proposal_id, $supervisor_unique_id, $comment]);

if (!$insertFeedbackResult) {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to insert feedback', 'error' => $error]);
    exit;
}

// Update status in the proposals table
$updateProposalQuery = "UPDATE proposals SET status = $1 WHERE proposal_id = $2";
$updateProposalResult = pg_query_params($connection, $updateProposalQuery, [$status, $proposal_id]);

if (!$updateProposalResult) {
    $error = pg_last_error($connection);
    echo json_encode(['status' => 'error', 'message' => 'Failed to update proposal status', 'error' => $error]);
    exit;
}

// If status is 'accepted', update the topics table
if ($status === 'accepted') {
    $updateTopicQuery = "UPDATE topics SET assigned_to = $1 WHERE topic_id = $2";
    $updateTopicResult = pg_query_params($connection, $updateTopicQuery, [$student_unique_id, $topic_id]);

    if (!$updateTopicResult) {
        $error = pg_last_error($connection);
        echo json_encode(['status' => 'error', 'message' => 'Failed to update topic assignment', 'error' => $error]);
        exit;
    }
}

echo json_encode(['status' => 'success', 'message' => 'Feedback recorded successfully']);
?>
