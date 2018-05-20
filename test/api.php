<?php
	header('Content-Type: text/html; charset=UTF-8');
	
	set_error_handler(function ($err_severity, $err_msg, $err_file, $err_line) {
		throw new ErrorException ($err_msg, 0, $err_severity, $err_file, $err_line);
	});


	$host = "localhost";
	$user = "root";
	$password = "1111";
	$db = "lingvo";
	$problem = "problem_words";
	$dict = "dictionary";
	$restable = "result";
	$allOk = TRUE;
	$resultT = [];
	try {
		$con = new mysqli($host, $user, $password, $db);
		if ($con->connect_errno) {
		    error_log("Не удалось подключиться: %s\n", $con->connect_error);
		    $allOk = FALSE;
		    exit();
		}
		$con->set_charset("utf8");

		$vars = get_angular_request_payload(); //Получаем данные
		

		switch ($vars['command']) {
			case 'getCommon':
				$getSameQuery = "select * from dictionary where word LIKE \"".$vars['word']."%\" order by word limit 1";
				$res = $con->query($getSameQuery);
				if (!$res) {
					header("HTTP/1.1 447 NOT OK");
					error_log($getSameQuery);
					error_log("Fail: ".$con->error);
					$allOk = FALSE;
					break;
				}
				if ($res->num_rows < 1) {
					$resultT[] = "0";
					$resultT[] = "Похожих нет";
					$resultT[] = "Похожих нет";
					$resultT[] = "Похожих нет";
					break;
				}
				$temp = $res->fetch_array(MYSQLI_BOTH);
					$resultT[] = $temp['id'];
					$resultT[] = $temp['word'];
					$resultT[] = $temp['descript'];
					$resultT[] = $temp['norm'];
				break;

			case 'loadInfo':
				$getOneLineQuery = "select * from $problem";
				$res = $con->query($getOneLineQuery);
				if ($res->num_rows > 0) {
					$temp = $res->fetch_array(MYSQLI_BOTH);
					$resultT[] = $temp['id'];
					$resultT[] = $temp['sentence'];
					$resultT[] = $temp['origin'];
					$resultT[] = $temp['pred_same'];
					$resultT[] = $temp['pred_corr'];

				} else {
					$resultT[] = "0";
					$resultT[] = "Слов больше нету)";
					$resultT[] = "Приходите завтра)";
					$resultT[] = "";
					$resultT[] = "";
					
				}
				break;

			case 'saveToBaseAndDelete':

				$saveNew = "INSERT INTO $restable(origin, correct, norm, gram) VALUES (\"".$vars['word']."\",\"".$vars['corr']."\",\"".$vars['norm']."\",\"". $vars['gram']."\")";
				if ($vars['corr'] == "" || $vars['norm'] == "" || $vars['gram'] == "") {
					error_log($vars['corr']."1".$vars['norm']."2".$vars['gram']);
					header("HTTP/1.1 444 NOT OK");
					$resultT[] = "Заполните все поля";
					$allOk = FALSE;
					break;
				}

				if ($vars['norm'] == "Похожих нет") {
					header("HTTP/1.1 444 NOT OK");
					$resultT[] = "Нужно слово, которое есть. Либо заполните поля";
					$allOk = FALSE;
					break;
				}

				$check = $con->query($saveNew);
				if (!$check) {
					header("HTTP/1.1 444 NOT OK");
					error_log($saveNew);
					error_log("Fail: ".$con->error);
					$resultT[] = "Не удалось добавить";
					$allOk = FALSE;
					break;
				}
				$deleteWorked = "DELETE FROM $problem WHERE id = ".$vars['id'];
				$check = $con->query($deleteWorked);
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
	if ($allOk) {
		header("HTTP/1.1 200 OK");	
	}
	echo json_encode($resultT, JSON_UNESCAPED_UNICODE, true);



	
	function get_angular_request_payload() {
 		return json_decode(file_get_contents('php://input'), true);
	}
?>