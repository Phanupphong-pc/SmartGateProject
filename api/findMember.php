<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

error_reporting(0);
ini_set('display_errors', 0);

$conn = new mysqli("localhost", "root", "", "smartgate");
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "เชื่อมต่อฐานข้อมูลล้มเหลว"]);
    exit();
}

$employee_id = isset($_GET['employee_id']) ? trim($_GET['employee_id']) : '';

if (empty($employee_id)) {
    echo json_encode(["status" => "error", "message" => "กรุณาส่งรหัสพนักงานเพื่อค้นหา"]);
    exit();
}

$stmt = $conn->prepare("SELECT * FROM memberlist WHERE employee_id = ?");
$stmt->bind_param("s", $employee_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    echo json_encode(["status" => "success", "data" => $data]);
} else {
    echo json_encode(["status" => "error", "message" => "ไม่พบข้อมูลพนักงาน"]);
}

$stmt->close();
$conn->close();
?>