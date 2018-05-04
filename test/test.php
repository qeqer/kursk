<?php
	PRINT "This is php script!";
	$host = "localhost";
	$user = "root";
	$password = "2912";
	$db = "test";
	$testtable = "test";
	
	$con = mysqli_connect($host, $user, $password, $db) or die("Фиаско с коннектом к БД!");

	echo "Я выбрал базу!";

	$testquery = "select * from $testtable";
	$res = mysqli_query($con, $testquery);
	mysqli_close($con);
	while ($row = mysqli_fetch_array($res)) {
		echo "<br>";
		echo "id: ".$row["id"];
		echo "word".$row["word"];

	}
?>
