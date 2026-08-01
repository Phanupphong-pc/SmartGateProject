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

set_exception_handler(function($e) {
    echo json_encode(["status" => "error", "message" => "ระบบขัดข้องหรือข้อมูลซ้ำ: " . $e->getMessage()]);
    exit();
});

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

// 💡 ดึงข้อมูลแบบ JSON Body (แทน $_POST เดิม)
$data = json_decode(file_get_contents("php://input"), true);

// รับค่าจาก React Native
$old_employee_id = isset($data['old_employee_id']) ? trim($data['old_employee_id']) : '';
$card_uid = isset($data['card_uid']) ? trim($data['card_uid']) : '';
$employee_id = isset($data['employee_id']) ? trim($data['employee_id']) : '';
$firstname = isset($data['firstname']) ? trim($data['firstname']) : '';
$lastname = isset($data['lastname']) ? trim($data['lastname']) : '';
$nickname = isset($data['nickname']) ? trim($data['nickname']) : '';
$department = isset($data['department']) ? trim($data['department']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$image = isset($data['image']) ? trim($data['image']) : '';
$status = isset($data['status']) ? trim($data['status']) : '';
$create_date = isset($data['create_date']) ? trim($data['create_date']) : '';

if (empty($old_employee_id) || empty($employee_id) || empty($firstname) || empty($lastname)) {
    echo json_encode(["status" => "error", "message" => "กรอกข้อมูลสำคัญไม่ครบถ้วน"]);
    exit();
}

$edit_date = date("Y-m-d H:i:s"); // อัปเดตเวลาแก้ไขล่าสุด

// กรณีที่ 1: ไม่ได้เปลี่ยน รหัสพนักงาน
if ($old_employee_id === $employee_id) {
    $sql = "UPDATE memberlist SET 
                card_uid = ?, 
                firstname = ?, 
                lastname = ?, 
                nickname = ?, 
                department = ?, 
                phone = ?, 
                image = ?, 
                status = ?, 
                create_date = ?, 
                edit_date = ? 
            WHERE employee_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssssss", $card_uid, $firstname, $lastname, $nickname, $department, $phone, $image, $status, $create_date, $edit_date, $employee_id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "แก้ไขข้อมูลเรียบร้อยแล้ว"]);
    } else {
        echo json_encode(["status" => "error", "message" => "แก้ไขข้อมูลไม่สำเร็จ"]);
    }
    $stmt->close();
}
// กรณีที่ 2: มีการเปลี่ยน รหัสพนักงาน ใหม่
else {
    // เช็คก่อนว่ารหัสใหม่ซ้ำไหม
    $check_stmt = $conn->prepare("SELECT employee_id FROM memberlist WHERE employee_id = ?");
    $check_stmt->bind_param("s", $employee_id);
    $check_stmt->execute();
    if ($check_stmt->get_result()->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "รหัสพนักงานใหม่นี้มีในระบบแล้ว"]);
        exit();
    }
    $check_stmt->close();

    // ลบเรคคอร์ดเดิม
    $del_stmt = $conn->prepare("DELETE FROM memberlist WHERE employee_id = ?");
    $del_stmt->bind_param("s", $old_employee_id);
    $del_stmt->execute();
    $del_stmt->close();

    // บันทึกเรคคอร์ดใหม่
    $ins_sql = "INSERT INTO memberlist (card_uid, employee_id, firstname, lastname, nickname, department, phone, image, status, create_date, edit_date) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $ins_stmt = $conn->prepare($ins_sql);
    $ins_stmt->bind_param("sssssssssss", $card_uid, $employee_id, $firstname, $lastname, $nickname, $department, $phone, $image, $status, $create_date, $edit_date);

    if ($ins_stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "เปลี่ยนรหัสและอัปเดตข้อมูลเรียบร้อยแล้ว"]);
    } else {
        echo json_encode(["status" => "error", "message" => "ไม่สามารถอัปเดตข้อมูลได้"]);
    }
    $ins_stmt->close();
}

$conn->close();
?>