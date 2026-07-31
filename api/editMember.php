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

// รับค่าจาก React Native
$old_employee_id = isset($_POST['old_employee_id']) ? trim($_POST['old_employee_id']) : '';
$card_uid = isset($_POST['card_uid']) ? trim($_POST['card_uid']) : '';
$employee_id = isset($_POST['employee_id']) ? trim($_POST['employee_id']) : '';
$firstname = isset($_POST['firstname']) ? trim($_POST['firstname']) : '';
$lastname = isset($_POST['lastname']) ? trim($_POST['lastname']) : '';
$nickname = isset($_POST['nickname']) ? trim($_POST['nickname']) : '';
$department = isset($_POST['department']) ? trim($_POST['department']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$image = isset($_POST['image']) ? trim($_POST['image']) : '';
$status = isset($_POST['status']) ? trim($_POST['status']) : '';
$create_date = isset($_POST['create_date']) ? trim($_POST['create_date']) : '';

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