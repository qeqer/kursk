angular
.module('contr', [])
.controller('fillManager', function($http) {
	var FM = this;
	FM.cur_id = "";
	FM.word = "";
	FM.sentence = "Слов нема";
	FM.in_word = "";
	FM.error_status = "";

	FM.keyParse = function($event) {
		switch ($event.keyCode + "") {
			case '33':
				FM.saveCorrect();
				break;
			case '34':
				FM.saveSame();
				break;
			default:
				break;
		}
	}

	FM.loadInfo = function() {
		$http
		.post('/api.php', {'command': 'loadInfo'})
		.then(function(res) {
			FM.cur_id = res["data"][0];
			FM.sentence = res["data"][1]; /*магия as is*/ 
			FM.word = res["data"][2];
			
		}, function() { //maybe sometime i will update headers (status) for it works, but not today
			FM.error_status = "WTF";
		});
	}

	FM.saveCorrect = function() {
		if (FM.in_word !== "") {
			FM.error_status = "Спасибо за помощь)";
			$http
			.post('/api.php', {'command': 'saveCorrect', 'word': FM.in_word, 'id': FM.cur_id})
			.then(function(res) {
				FM.error_status = res["data"][0];
				FM.loadInfo();
			}, function(res) {
				FM.error_status = "WTF";
			});	

			FM.in_word = "";
		} else {
			FM.error_status = "Введите слово, позязки("
		}
	}

	FM.saveSame = function() {
		if (FM.in_word !== "") {
			FM.error_status = "Спасибо за помощь)";
			$http
			.post('/api.php', {'command': 'saveSame', 'word': FM.in_word, 'id': FM.cur_id})
			.then(function(res) {
				FM.error_status = res["data"][0];
				FM.loadInfo();
			}, function(res) {
				FM.error_status = "WTF";
			});	

			FM.in_word = "";
		} else {
			FM.error_status = "Введите слово, позязки("
		}
	}


	
	
	FM.loadInfo();
});