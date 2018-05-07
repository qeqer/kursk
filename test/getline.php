<?php
	$host = "localhost";
	$user = "root";
	$password = "2912";
	$db = "lingvo";
	$table = "words";
	$getOneLineQuery = "select * from $table where (correct is null) limit 1";

	$con = new mysqli($host, $user, $password, $db);

	if ($con->connect_errno) {
	    printf("Не удалось подключиться: %s\n", $con->connect_error);
	    exit();
	}
	$con->set_charset("utf8");
	
	$res = $con->query($getOneLineQuery);
	$con->close();
	$row = $res->fetch_array(MYSQLI_BOTH);
	echo $row["sentence"]."<br>";
	echo "Неизвестное слово: ".$row["origin"];
?>
