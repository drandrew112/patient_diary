<?php
require "helpers.php";

if (!isset($_SESSION["account_id"])) {
    echo json_encode(["account" => null]);
    exit;
}

echo json_encode([
    "account" => [
        "id" => $_SESSION["account_id"],
        "email" => $_SESSION["email"]
    ]
]);