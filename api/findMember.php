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

$employee_id = isset($_GET['employee_id']) ? trim($_GET['employee_id']) : '';

if (empty($employee_id)) {
    echo json_encode(["status" => "error", "message" => "กรุณาระบุรหัสพนักงาน"]);
    exit();
}

// ดึงข้อมูลทั้ง 11 ฟิลด์
$sql = "SELECT card_uid, employee_id, firstname, lastname, nickname, department, phone, image, status, create_date, edit_date 
        FROM memberlist 
        WHERE employee_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $employee_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    echo json_encode([
        "status" => "success",
        "data" => $data
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "ไม่พบข้อมูลพนักงานรหัสนี้"
    ]);
}

$stmt->close();
$conn->close();
?>