<?php
include 'db.php';

// Get the unique_id from the frontend
$unique_id = $_POST['encrypted_unique_id'];

// Construct the SQL query to select the user's name based on unique_id
$sql = "SELECT name FROM users WHERE unique_id = '$unique_id'";
$result = pg_query($connection, $sql);

if ($result) {
    // Check if any rows were returned
    if (pg_num_rows($result) > 0) {
        // Fetch the user's name
        $row = pg_fetch_assoc($result);
        $name = $row['name'];

        // Send the user's name as JSON response to frontend
        echo json_encode(['success' => true, 'name' => $name]);
    } else {
        // Send error response if unique_id is not found
        echo json_encode(['success' => false, 'error' => 'User not found']);
    }
} else {
    // Send error response if query fails
    echo json_encode(['success' => false, 'error' => pg_last_error($connection)]);
}

pg_close($connection);
?>
