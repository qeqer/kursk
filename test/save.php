
<?php

	$host = "localhost";
	$user = "root";
	$password = "2912";
	$db = "lingvo";
	$table = "words";
	
	$con = new mysqli($host, $user, $password, $db);

	if ($con->connect_errno) {
	    printf("Не удалось подключиться: %s\n", $con->connect_error);
	    exit();
	}
	$con->set_charset("utf8");
	
	$con->query($modifyQuery);



	$vars = get_angular_request_payload();

	function get_angular_request_payload() {
   		return json_decode(file_get_contents('php://input'), true);
	}
?>