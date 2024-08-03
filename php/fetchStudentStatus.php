<?php
include 'db.php';

// Fetch student unique ID from request
$unique_id = $_POST['encrypted_unique_id'] ?? '';

if (!$unique_id) {
    echo json_encode(['status' => 'error', 'message' => 'Unique ID is required']);
    exit;
}

// Fetch student status and assigned supervisor from student_supervisor table
$statusQuery = "SELECT status, supervisor_unique_id FROM student_supervisor WHERE student_unique_id = $1";
$statusResult = pg_query_params($connection, $statusQuery, [$unique_id]);

$statusRow = pg_fetch_assoc($statusResult);
$status = $statusRow['status'] ?? 'pending';
$assignedSupervisorId = $statusRow['supervisor_unique_id'] ?? '';

// Fetch student department from users table
$departmentQuery = "SELECT department FROM users WHERE unique_id = $1";
$departmentResult = pg_query_params($connection, $departmentQuery, [$unique_id]);

$departmentRow = pg_fetch_assoc($departmentResult);
$department = $departmentRow['department'] ?? '';

// Fetch available supervisors from the users table in the same department
$supervisorsQuery = "SELECT unique_id, name, current_students, max_students FROM users WHERE user_type = 'supervisor' AND department = $1";
$supervisorsResult = pg_query_params($connection, $supervisorsQuery, [$department]);

$supervisors = [];
while ($supervisorRow = pg_fetch_assoc($supervisorsResult)) {
    $supervisorRow['disabled'] = $supervisorRow['current_students'] >= $supervisorRow['max_students'];
    $supervisors[] = $supervisorRow;
}

$response = [
    'status' => $status,
    'assignedSupervisorId' => $assignedSupervisorId,
    'supervisors' => $supervisors,
];

echo json_encode($response);
?>
