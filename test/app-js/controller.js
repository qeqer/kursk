angular
.module('contr', [])
.controller('fillManager', function($http) {
	var FM = this;
	FM.cur_id = "0";
	FM.word = "";
	FM.sentence = "Слов нема";
	FM.in_word = "";
	FM.error_status = "";
	FM.same_word = "";
	FM.desc = "";
	FM.norm = "";
	FM.suf = "";
	FM.pref = "";

	FM.our_desc = "";
	FM.our_norm = "";
	FM.our_suf = "";
	FM.our_pref = "";


	

	FM.getCommon = function() {
		$http
		.post('/api.php', {'command': 'getCommon', 'word': FM.in_word})
		.then(
			function(res) {
				FM.same_word = res["data"][1];
				FM.desc = res["data"][2];
				FM.norm = res["data"][3];
				FM.suf = res["data"][4];
				FM.pref = res["data"][5];
				if (undefined !== FM.pref && FM.cur_id !== "0") {
					FM.our_norm = FM.word.slice(FM.pref.length, -FM.suf.length + 1);
					FM.our_desc = FM.desc;
					FM.our_suf = FM.word.slice(-FM.suf.length);
					FM.our_pref = FM.word.slice(0, FM.pref.length);
				}
				if (res["data"][0] == "0") {
					FM.our_norm = "";
					FM.our_desc = "";
					FM.our_suf = "";
					FM.our_pref = "";	
				}
			},
			function() {
				FM.error_status = res["data"][0];
			}
		)
	}


	FM.keyParse = function($event) {
		switch ($event.keyCode + "") {
			case '33':
				FM.saveCorrectExist();
				break;
			case '34':
				FM.saveCorrectNew();
				break;
			case '35':
				FM.saveSame();
				break;
			case '38':
				FM.saveSamePredicted();
				break;
			case '40':
				FM.getCommon();
			default:
				if (FM.in_word.length > 3) {
					FM.getCommon();
				}
		}
	}

	FM.loadInfo = function() {
		$http
		.post('/api.php', {'command': 'loadInfo'})
		.then(function(res) {
			FM.cur_id = res["data"][0];
			FM.sentence = res["data"][1]; /*магия as is*/ 
			FM.word = res["data"][2];
			
		}, function() {
			FM.error_status = "WTF";
		});
	}

	FM.saveCorrectExist = function() {
		if (FM.in_word !== "") {
			FM.error_status = "Спасибо за помощь)";
			$http
			.post('/api.php', {'command': 'saveCorrectExist', 'word': FM.in_word, 'id': FM.cur_id})
			.then(function(res) {
				FM.error_status = res["data"][0];
				FM.loadInfo();
				FM.in_word = "";
			}, function(res) {
				FM.error_status = res["data"][0];
			});	

			
		} else {
			FM.error_status = "Введите слово, позязки("
		}
	}

	FM.saveCorrectNew = function() {
		if (FM.in_word !== "") {
			FM.error_status = "Спасибо за помощь)";
			$http
			.post('/api.php', {'command': 'saveCorrectNew', 'word': FM.in_word, 'id': FM.cur_id, 'pref': FM.our_pref, 
				'suf': FM.our_suf, 'desc': FM.our_desc, 'norm': FM.our_norm})
			.then(function(res) {
				FM.error_status = res["data"][0];
				FM.loadInfo();
				FM.in_word = "";
				FM.our_pref = "";
				FM.our_norm = "";
				FM.our_suf = "";
				FM.our_desc = "";
			}, function(res) {
				FM.error_status = res["data"][0];
			});
		} else {
			FM.error_status = "Введите слово, позязки("
		}
	}

	FM.saveSame = function() {
		if (FM.in_word !== "") {
			FM.error_status = "Спасибо за помощь)";
			$http
			.post('/api.php', {'command': 'saveSame', 
				'word': FM.in_word, 'id': FM.cur_id, 'pref': FM.our_pref, 
				'suf': FM.our_suf, 'desc': FM.our_desc, 'norm': FM.our_norm})
			.then(function(res) {
				FM.error_status = res["data"][0];
				FM.loadInfo();
			}, function(res) {
				FM.error_status = res["data"][0];
			});	

			FM.in_word = "";
		} else {
			FM.error_status = "Введите слово, позязки("
		}
	}
	
	FM.saveSamePredicted = function() {
		if (FM.in_word !== "Похожих нет") {
			FM.in_word = FM.same_word;	
		}
		

	}
	
	FM.loadInfo();
});