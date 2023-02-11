<?php

// Config
$server = "";
$username = "";
$password = "";
$database = "";

// headers
ini_set('max_execution_time', '1700');
set_time_limit(1700);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Content-Type: application/json; charset=utf-8');
http_response_code(200);

//connect
$sqlConnect = mysqli_connect($server, $username, $password, $database);
mysqli_set_charset($sqlConnect, "utf8mb4");
if ($sqlConnect === false) {
    $result["state"] = false;
    $result["error"]["message"] = "error connecting to MySQL";
    echo json_encode($result);
    exit;
}

// code
$input = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (!array_key_exists("dataId", $_GET)) {
        $result["state"] = false;
        $result["error"]["message"][] = "filed request";
        echo json_encode($result);
        exit;
    }
    $sql = "SELECT * FROM `deepLinkData` WHERE `id` = '".$_GET["dataId"]."' LIMIT 1";
    $getData = mysqli_fetch_all(mysqli_query($sqlConnect, $sql), MYSQLI_ASSOC)[0];
    if ($getData == NULL) {
        $result["state"] = false;
        $result["error"]["message"][] = "not found";
        echo json_encode($result);
        exit;
    }
    $result["state"] = true;
    $result["variables"] = json_decode($getData["variables"], true);
    $result["cookies"] = json_decode($getData["cookies"], true);
    $result["context"] = json_decode($getData["context"], true);
    echo json_encode($result);
    if (array_key_exists("delete", $_GET)) {
        mysqli_query($sqlConnect, "DELETE FROM `deepLinkData` WHERE `id` = '".$_GET["dataId"]."' LIMIT 1");
    }
} else if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($input == NULL || !array_key_exists("variables", $input)) {
        $input["variables"] = [];
    }
    $variables = mysqli_real_escape_string($sqlConnect, json_encode($input["variables"], JSON_UNESCAPED_UNICODE));
    $cookies = mysqli_real_escape_string($sqlConnect, json_encode($_COOKIE, JSON_UNESCAPED_UNICODE));
    $contextData["referer"] = $_SERVER["HTTP_REFERER"];
    $contextData["user_agent"] = $_SERVER["HTTP_USER_AGENT"];
    $contextData["ip"] = $_SERVER["REMOTE_ADDR"];
    $contextData["timestamp"] = $_SERVER["REQUEST_TIME"];
    $contextData["device_os"] = $_SERVER["HTTP_SEC_CH_UA_PLATFORM"];
    $context = mysqli_real_escape_string($sqlConnect, json_encode($contextData, JSON_UNESCAPED_UNICODE));
    $sql = "INSERT INTO `deepLinkData` (`variables`, `cookies`, `context`) VALUES ('".$variables."', '".$cookies."', '".$context."')";
    $insert = mysqli_query($sqlConnect, $sql);
    if ($insert === false) {
        $result["state"] = false;
        $result["error"]["message"][] = "failed insert data";
        $result["error"]["message"][] = mysqli_error($sqlConnect);
        echo json_encode($result);
        exit;
    }
    $result["state"] = true;
    $result["insertId"] = mysqli_insert_id($sqlConnect);
    $result["data"]["variables"] = $input["variables"];
    $result["data"]["cookies"] = $_COOKIE;
    $result["data"]["context"] = $contextData;
    echo json_encode($result);
} else {
    $result["state"] = false;
    $result["error"]["message"][] = "not supported method request";
    echo json_encode($result);
}