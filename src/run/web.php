<?php
use TJM\Life10k\HTTP;
require_once(__DIR__ . '/../../vendor/autoload.php');

error_reporting(-1); ini_set('display_errors', 1);

$http = new HTTP($_GET);
echo $http->getResponse();
