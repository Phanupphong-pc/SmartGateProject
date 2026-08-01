<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$conn = new mysqli("localhost", "root", "", "smartgate");

$data = json_decode(file_get_contents("php://input"), true);

$firstname = $data["firstname"] ?? "";
$lastname = $data["lastname"] ?? "";
$card_uid = $data["card_uid"] ?? "";
$employee_id = $data["employee_id"] ?? "";
$nickname = $data["nickname"] ?? "";
$department = $data["department"] ?? "";
$phone = $data["phone"] ?? "";
$image = $data["image"] ?? "";
$create_date = $data["create_date"] ?? date("Y-m-d H:i:s");
$edit_date = $data["edit_date"] ?? date("Y-m-d H:i:s");
$status = $data["status"] ?? "Active";

// ตรวจสอบข้อมูลที่จำเป็น
if ($firstname == "" || $lastname == "" || $employee_id == "") {
    echo json_encode([
        "status" => "error",
        "message" => "กรุณากรอกข้อมูลให้ครบ"
    ]);
    exit();
}

$conn->set_charset("utf8mb4");

$sql = "INSERT INTO memberlist (firstname, lastname, card_uid, employee_id, nickname, department, phone, image, status, create_date, edit_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "sssssssssss",
    $firstname,
    $lastname,
    $card_uid,
    $employee_id,
    $nickname,
    $department,
    $phone,
    $image,
    $status,
    $create_date,
    $edit_date
);

try {
    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "บันทึกข้อมูลสำเร็จ"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "บันทึกไม่สำเร็จ"
        ]);
    }
} catch (mysqli_sql_exception $e) {
    // Check if it's a duplicate entry error (error code 1062)
    if ($e->getCode() == 1062) {
        echo json_encode([
            "status" => "error",
            "message" => "ข้อมูลซ้ำ (มีรหัสพนักงานหรือเลขบัตรนี้ในระบบแล้ว)"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "เกิดข้อผิดพลาดในการบันทึกข้อมูล: " . $e->getMessage()
        ]);
    }
}

$stmt->close();
$conn->close();

?>