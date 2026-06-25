<?php
require "helpers.php";

session_destroy();

echo json_encode(["success" => true]);