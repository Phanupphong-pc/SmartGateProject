<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    exit(0);
}

$conn = new mysqli("localhost", "root", "", "smartgate");
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "เชื่อมต่อฐานข้อมูลไม่สำเร็จ"
    ]);
    exit();
}

$employee_id = isset($_GET["employee_id"]) ? trim($_GET["employee_id"]) : "";

if ($employee_id == "") {
    echo json_encode([
        "status" => "error",
        "message" => "ไม่พบรหัสพนักงาน",
        "data" => []
    ]);
    exit();
}

$sql = "SELECT scan_id, card_uid, employee_id, scan_date, scan_time
        FROM checklist
        WHERE employee_id = ?
        ORDER BY scan_time DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $employee_id);
$stmt->execute();
$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "status" => "success",
    "data" => $data
]);

$stmt->close();
$conn->close();
?>