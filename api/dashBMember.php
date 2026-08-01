<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "smartgate";

$conn = new mysqli($host, $user, $pass, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "เชื่อมต่อฐานข้อมูลไม่สำเร็จ"
    ]);
    exit();
}

// รับวันที่
$date = isset($_GET["date"]) ? $_GET["date"] : date("Y-m-d");

// นับสมาชิกทั้งหมด
$sql = "SELECT COUNT(*) AS total
        FROM memberlist
        WHERE status='Active'";

$result = $conn->query($sql);
$row = $result->fetch_assoc();
$total = $row["total"];

// นับคนที่เช็คแล้ว (ไม่ซ้ำ)
$sql = "SELECT COUNT(DISTINCT employee_id) AS checked
        FROM checklist
        WHERE scan_date='$date'";

$result = $conn->query($sql);
$row = $result->fetch_assoc();
$checked = $row["checked"];

// คนที่ยังไม่เช็ค
$pending = $total - $checked;

// ดึงรายชื่อสมาชิกทั้งหมด
$sql = "SELECT * FROM memberlist
        WHERE status='Active'
        ORDER BY firstname ASC";

$result = $conn->query($sql);

$members = array();

while ($row = $result->fetch_assoc()) {

    $employee_id = $row["employee_id"];

    // เช็คว่าพนักงานคนนี้เช็คชื่อแล้วหรือยัง
    $check_sql = "SELECT MAX(scan_time) AS last_scan
                  FROM checklist
                  WHERE employee_id='$employee_id'
                  AND scan_date='$date'";

    $check_result = $conn->query($check_sql);
    $check_row = $check_result->fetch_assoc();

    if ($check_row["last_scan"] != null) {
        $status = "Checked";
        $last_scan = $check_row["last_scan"];
    } else {
        $status = "Pending";
        $last_scan = "";
    }

    $members[] = array(
        "card_uid" => $row["card_uid"],
        "employee_id" => $row["employee_id"],
        "firstname" => $row["firstname"],
        "lastname" => $row["lastname"],
        "nickname" => $row["nickname"],
        "department" => $row["department"],
        "phone" => $row["phone"],
        "image" => $row["image"],
        "status" => $status,
        "last_scan" => $last_scan
    );
}

// ส่งข้อมูลกลับ
echo json_encode(array(
    "status" => "success",
    "total" => $total,
    "checked" => $checked,
    "pending" => $pending,
    "members" => $members
));

$conn->close();

?>