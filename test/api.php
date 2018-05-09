<?php
	set_error_handler(function ($err_severity, $err_msg, $err_file, $err_line) {
		throw new ErrorException ($err_msg, 0, $err_severity, $err_file, $err_line);
	});
	header('Content-Type: text/html; charset=UTF-8');
	header("HTTP/1.1 200 OK");
	
	$host = "localhost";
	$user = "root";
	$password = "1111";
	$db = "lingvo";
	$table = "problem_words";
	$getOneLineQuery = "select * from $table where (correct is null) and (same_word is null)  limit 1";
/*	
	$saveSameQuery = "UPDATE problem_words SET same_word = $returnedSame where id = $id_num";

	*/

	$resultT = [];
	try {
		$con = new mysqli($host, $user, $password, $db);
		if ($con->connect_errno) {
		    printf("Не удалось подключиться: %s\n", $con->connect_error);
		    exit();
		}
		$con->set_charset("utf8");

		$vars = get_angular_request_payload(); //Получаем данные
		

		switch ($vars['command']) {
			case 'loadInfo':
				$res = $con->query($getOneLineQuery);
				if ($res->num_rows > 0) {
					$temp = $res->fetch_array(MYSQLI_BOTH);
					$resultT[] = $temp['id'];
					$resultT[] = $temp['sentence'];/*магия as is, боремся с кавычками как черти*/
					$resultT[] = $temp['origin'];
					$resultT[] = "";

				} else {
					$resultT[] = "0";
					$resultT[] = "Слов больше нету)";
					$resultT[] = "Приходите завтра)";
				}
				/*добавить уведомление о нуле записей*/
				break;
			case 'saveCorrect':
				$saveCorrectQuery = "UPDATE $table SET correct = ".$vars['word']." where id = ".$vars['id'];
				$check = $con->query($saveCorrectQuery);
				if (!$check) { //Why i cant just print $check to error log????
					error_log("Fail: ".$con->error);
					$resultT[] = "Не удалось добавить";
					break;
				}
				
				$resultT[] = "Ответ успешно записан)";
				break;
		}
		$con->close();

	} catch (Exception $e) {
		error_log("!!!".$e->getMessage()."\n");
		$resultT[] = "ERROR";
		echo json_encode($resultT, JSON_UNESCAPED_UNICODE, true);
		exit(0);
	}
	echo json_encode($resultT, JSON_UNESCAPED_UNICODE, true);



	
	function get_angular_request_payload() {
 		return json_decode(file_get_contents('php://input'), true);
	}
?>
