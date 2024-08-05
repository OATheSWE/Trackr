<?php
include 'db.php'; // Include your database connection file

// Retrieve form data
$topic_department = 'Law';

// Static topics data (can be extended or modified as needed)
$topics = [
    "JUSTIFICATION FOR AND THE ABOLITION OF CAPITAL PUNISHMENT UNDER HUMAN RIGHTS LAW",
    "JUDICIAL ATTITUDE TO HOMICIDE IN NIGERIA",
    "INSURANCE AS PECULIAR SPECIE OF THE LAW OF CONTRACT",
    "EXCESS OF INJUNCTION IN NIGERIA JUDICIAL SYSTEM",
    "AVAILABILITY AND UTILIZATION OF INFORMATION RESOURCES IN NIGERIAN LAW LIBRARIES BY LAW STUDENTS",
];




// Insert topics into the database
for ($i = 0; $i < count($topics); $i++) {
    $topic_name = $topics[$i];
    $topic_link = strtolower(str_replace(' ', '-', $topic_name));
    $departmentPath = strtolower(str_replace(' ', '-', $topic_department));
    $formatted_link = "https://eduprojects.ng/{$departmentPath}/{$topic_link}/latest-project-topics-materials-and-research-ideas";
    $assigned_to = null; // Initially not assigned to any student

    // Prepare SQL query
    $query = "INSERT INTO topics (topic_department, topic_name, topic_link, assigned_to) VALUES ($1, $2, $3, $4)";
    $result = pg_query_params($connection, $query, [$topic_department, $topic_name, $formatted_link, $assigned_to]);

    // Check query result
    if (!$result) {
        $error = pg_last_error($connection);
        echo json_encode(['status' => 'error', 'message' => 'Failed to upload topic', 'error' => $error]);
        exit;
    }
}

echo json_encode(['status' => 'success', 'message' => 'Topics uploaded successfully']);
