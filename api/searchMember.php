<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    exit(0);
}

$conn = new mysqli("localhost", "root", "", "smartgate");
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "เชื่อมต่อฐานข้อมูลไม่สำเร็จ"
    ]);
    exit();
}

$keyword = isset($_GET["keyword"]) ? trim($_GET["keyword"]) : "";

if ($keyword == "") {
    echo json_encode([
        "status" => "error",
        "message" => "กรุณากรอกข้อมูลที่ต้องการค้นหา",
        "data" => []
    ]);
    exit();
}

$search = "%" . $keyword . "%";

$sql = "SELECT * FROM memberlist
        WHERE card_uid LIKE ?
        OR employee_id LIKE ?
        OR firstname LIKE ?
        OR lastname LIKE ?
        OR nickname LIKE ?
        OR department LIKE ?
        ORDER BY firstname ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssss", $search, $search, $search, $search, $search, $search);
$stmt->execute();
$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

if (count($data) > 0) {
    echo json_encode([
        "status" => "success",
        "data" => $data
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "ไม่พบข้อมูลพนักงาน",
        "data" => []
    ]);
}

$stmt->close();
$conn->close();
?>