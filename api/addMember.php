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

// ตรวจสอบข้อมูลที่จำเป็น
if ($firstname == "" || $lastname == "" || $employee_id == "") {
    echo json_encode([
        "status" => "error",
        "message" => "กรุณากรอกข้อมูลให้ครบ"
    ]);
    exit();
}

$sql = "INSERT INTO memberlist
(
    firstname,
    lastname,
    card_uid,
    employee_id,
    nickname,
    department,
    phone,
    image,
    create_date,
    edit_date
)
VALUES
(
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ssssssssss",
    $firstname,
    $lastname,
    $card_uid,
    $employee_id,
    $nickname,
    $department,
    $phone,
    $image,
    $create_date,
    $edit_date
);

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

$stmt->close();
$conn->close();

?>