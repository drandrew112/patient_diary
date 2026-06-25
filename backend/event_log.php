<?php
require "helpers.php";
require "mysql.php";

$accountId = requireLogin();
$method = $_SERVER["REQUEST_METHOD"];

function ownsPatientEvent($pdo, $patientId, $accountId) {
    $stmt = $pdo->prepare("SELECT id FROM patients WHERE id = ? AND account_id = ?");
    $stmt->execute([$patientId, $accountId]);
    return $stmt->fetch();
}

function safeFileName($name) {
    $name = basename($name);
    $name = preg_replace('/[^a-zA-Z0-9._-]/', '_', $name);
    return time() . "_" . $name;
}

if ($method === "GET") {
    $patientId = $_GET["patient_id"] ?? 0;

    if (!ownsPatientEvent($pdo, $patientId, $accountId)) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM event_log WHERE patient_id = ? ORDER BY created_at DESC");
    $stmt->execute([$patientId]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method === "POST") {
    $id = $_POST["id"] ?? null;
    $patientId = $_POST["patient_id"] ?? 0;

    if (!ownsPatientEvent($pdo, $patientId, $accountId)) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden"]);
        exit;
    }

    $createdAt = $_POST["created_at"] ?? date("Y-m-d H:i:s");
    $displayNames = json_decode($_POST["displayNames"] ?? "[]", true);
    if (!is_array($displayNames)) {
        $displayNames = [];
    }
    $existingFiles = json_decode($_POST["existingFiles"] ?? "[]", true);
    if (!is_array($existingFiles)) {
        $existingFiles = [];
    }
    $text = $_POST["text"] ?? "";

    if ($id) {
        $stmt = $pdo->prepare("
            UPDATE event_log
            SET created_at = ?, text = ?
            WHERE id = ? AND patient_id = ?
        ");
        $stmt->execute([$createdAt, $text, $id, $patientId]);

        $eventId = $id;
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO event_log (patient_id, created_at, text, files)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$patientId, $createdAt, $text, "[]"]);

        $eventId = $pdo->lastInsertId();
    }

    $baseDir = __DIR__ . "/uploads/events/" . $eventId;
    $relativeBaseDir = "uploads/events/" . $eventId;

    if (!is_dir($baseDir)) {
        mkdir($baseDir, 0775, true);
    }

    $savedFiles = [];

    if (isset($_FILES["files"])) {
        foreach ($_FILES["files"]["tmp_name"] as $index => $tmpName) {
            if ($_FILES["files"]["error"][$index] !== UPLOAD_ERR_OK) {
                continue;
            }

            $originalName = $_FILES["files"]["name"][$index];
            $fileName = safeFileName($originalName);
            $targetPath = $baseDir . "/" . $fileName;

            if (move_uploaded_file($tmpName, $targetPath)) {
                $relativePath = $relativeBaseDir . "/" . $fileName;

                $displayName = pathinfo($originalName, PATHINFO_FILENAME);

                foreach ($displayNames as $meta) {
                    if (($meta["name"] ?? "") === $originalName) {
                        $displayName = $meta["displayName"] ?? $displayName;
                        break;
                    }
                }

                $savedFiles[] = [
                    "path" => $relativePath,
                    "name" => $originalName,
                    "displayName" => $displayName
                ];
            }
        }
    }

    $allFiles = array_merge($existingFiles, $savedFiles);

    $stmt = $pdo->prepare("UPDATE event_log SET files = ? WHERE id = ?");
    $stmt->execute([json_encode($allFiles, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), $eventId]);

    echo json_encode([
        "success" => true,
        "id" => $eventId,
        "files" => $savedFiles
    ]);
    exit;
}

if ($method === "DELETE") {
    $id = $_GET["id"] ?? 0;

    $stmt = $pdo->prepare("
        SELECT el.id
        FROM event_log el
        INNER JOIN patients p ON p.id = el.patient_id
        WHERE el.id = ? AND p.account_id = ?
    ");
    $stmt->execute([$id, $accountId]);

    if (!$stmt->fetch()) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM event_log WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(["success" => true]);
    exit;
}
