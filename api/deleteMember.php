<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

error_reporting(0);
ini_set('display_errors', 0);

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "smartgate";

$conn = new mysqli($host, $user, $pass, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "เชื่อมต่อฐานข้อมูลล้มเหลว"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$employee_id = isset($data['employee_id']) ? trim($data['employee_id']) : '';

if (empty($employee_id)) {
    echo json_encode(["status" => "error", "message" => "ไม่พบรหัสพนักงานที่จะลบ"]);
    exit();
}

$stmt = $conn->prepare("DELETE FROM memberlist WHERE employee_id = ?");
$stmt->bind_param("s", $employee_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "ลบข้อมูลพนักงานเรียบร้อยแล้ว"]);
} else {
    echo json_encode(["status" => "error", "message" => "ไม่สามารถลบข้อมูลได้"]);
}

$stmt->close();
$conn->close();
?>