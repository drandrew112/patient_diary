<?php
require "helpers.php";
require "mysql.php";

$accountId = requireLogin();
$method = $_SERVER["REQUEST_METHOD"];

function ownsPatient($pdo, $patientId, $accountId) {
    $stmt = $pdo->prepare("SELECT id FROM patients WHERE id = ? AND account_id = ?");
    $stmt->execute([$patientId, $accountId]);
    return $stmt->fetch();
}

if ($method === "GET") {
    $patientId = $_GET["patient_id"] ?? 0;

    if (!ownsPatient($pdo, $patientId, $accountId)) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM patient_log WHERE patient_id = ? ORDER BY created_at DESC");
    $stmt->execute([$patientId]);
    echo json_encode($stmt->fetchAll());
    exit;
}

$data = jsonInput();

if ($method === "POST") {
    if (!ownsPatient($pdo, $data["patient_id"] ?? 0, $accountId)) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden"]);
        exit;
    }

    $createdAt = $data["created_at"] ?? date("Y-m-d H:i:s");

    $stmt = $pdo->prepare("
        INSERT INTO patient_log 
        (patient_id, created_at, ab_oxysat, c_pulse, c_bp_left_sis, c_bp_left_dis, c_bp_right_sis, c_bp_right_dis, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $data["patient_id"],
        $createdAt,
        $data["ab_oxysat"] ?? null,
        $data["c_pulse"] ?? null,
        $data["c_bp_left_sis"] ?? null,
        $data["c_bp_left_dis"] ?? null,
        $data["c_bp_right_sis"] ?? null,
        $data["c_bp_right_dis"] ?? null,
        $data["notes"] ?? null
    ]);

    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    exit;
}

if ($method === "DELETE") {
    $id = $_GET["id"] ?? 0;

    $stmt = $pdo->prepare("
        DELETE pl FROM patient_log pl
        INNER JOIN patients p ON p.id = pl.patient_id
        WHERE pl.id = ? AND p.account_id = ?
    ");
    $stmt->execute([$id, $accountId]);

    echo json_encode(["success" => true]);
    exit;
}
