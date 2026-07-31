<?php

header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "regist");

$data = json_decode(file_get_contents("php://input"), true);

$firstname = $data["firstname"];
$lastname = $data["lastname"];
$cardId = $data["cardId"];
$employeeId = $data["employeeId"];
$nickname = $data["nickname"];
$department = $data["department"];
$phone = $data["phone"];

$sql = "INSERT INTO employee
(firstname,lastname,cardId,employeeId,nickname,department,phone)
VALUES
(?,?,?,?,?,?,?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "sssssss",
    $firstname,
    $lastname,
    $cardId,
    $employeeId,
    $nickname,
    $department,
    $phone
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