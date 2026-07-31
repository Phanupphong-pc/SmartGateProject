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

$card_uid = isset($_POST['card_uid']) ? trim($_POST['card_uid']) : '';
$employee_id = isset($_POST['employee_id']) ? trim($_POST['employee_id']) : '';
$firstname = isset($_POST['firstname']) ? trim($_POST['firstname']) : '';
$lastname = isset($_POST['lastname']) ? trim($_POST['lastname']) : '';
$nickname = isset($_POST['nickname']) ? trim($_POST['nickname']) : '';
$department = isset($_POST['department']) ? trim($_POST['department']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$image = isset($_POST['image']) ? trim($_POST['image']) : '';
$status = isset($_POST['status']) ? trim($_POST['status']) : 'active';

if (empty($employee_id) || empty($firstname) || empty($lastname)) {
    echo json_encode(["status" => "error", "message" => "กรุณากรอกรหัสพนักงาน ชื่อ และนามสกุล"]);
    exit();
}

// เช็คว่ารหัสพนักงานซ้ำไหม
$check_stmt = $conn->prepare("SELECT employee_id FROM memberlist WHERE employee_id = ?");
$check_stmt->bind_param("s", $employee_id);
$check_stmt->execute();
if ($check_stmt->get_result()->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "รหัสพนักงานนี้มีอยู่ในระบบแล้ว"]);
    exit();
}
$check_stmt->close();

$now = date("Y-m-d H:i:s");

$sql = "INSERT INTO memberlist (card_uid, employee_id, firstname, lastname, nickname, department, phone, image, status, create_date, edit_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssssss", $card_uid, $employee_id, $firstname, $lastname, $nickname, $department, $phone, $image, $status, $now, $now);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "เพิ่มข้อมูลสมาชิกเรียบร้อยแล้ว"]);
} else {
    echo json_encode(["status" => "error", "message" => "ไม่สามารถเพิ่มข้อมูลได้"]);
}

$stmt->close();
$conn->close();
?>