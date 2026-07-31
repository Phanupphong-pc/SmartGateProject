<?php

header("Content-Type: application/json");

$conn = new mysqli("localhost","root","","regist");

$data = json_decode(file_get_contents("php://input"), true);

$firstname  = $data["firstname"] ?? "";
$lastname   = $data["lastname"] ?? "";
$cardId     = $data["cardId"] ?? "";
$employeeId = $data["employeeId"] ?? "";
$nickname   = $data["nickname"] ?? "";
$department = $data["department"] ?? "";
$phone      = $data["phone"] ?? "";
$image      = $data["image"] ?? "";
$createDate = $data["createDate"] ?? date("Y-m-d H:i:s");
$editDate   = $data["editDate"] ?? date("Y-m-d H:i:s");

// ตรวจสอบข้อมูลที่จำเป็น
if ($firstname == "" || $lastname == "" || $employeeId == "") {
    echo json_encode([
        "status" => "error",
        "message" => "กรุณากรอกข้อมูลให้ครบ"
    ]);
    exit();
}

$sql = "INSERT INTO employee
(
    firstname,
    lastname,
    cardId,
    employeeId,
    nickname,
    department,
    phone,
    image,
    createDate,
    editDate
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
    $cardId,
    $employeeId,
    $nickname,
    $department,
    $phone,
    $image,
    $createDate,
    $editDate
);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "บันทึกข้อมูลสำเร็จ"
    ]);
} else {
    echo json_encode([
        "status"=>"error",
        "message"=>"บันทึกไม่สำเร็จ"
    ]);
}

$stmt->close();
$conn->close();

?>