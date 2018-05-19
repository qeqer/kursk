angular
.module('contr', ['ngSanitize'])
.controller('fillManager', function($http) {
	var FM = this;
	FM.cur_id = "0";
	FM.word = "";
	FM.sentence = "Слов нема";
	FM.in_word = "";
	FM.error_status = "";
	FM.same_word = "";
	FM.gram = "";
	FM.norm = "";
	FM.suf = "";
	FM.pref = "111";
	FM.our_norm = "";
	FM.pred_corr = ""; //полученное из бд с исправленной ошибкой
	FM.pred_same = ""; //полученное из бд с похожим разбором

	FM.findIntersectFromStart = function(a, b) {
		for (i = a.length; i > 0; i--) {
			d = a.substring(0,i);
			j = b.indexOf(d);
			if (j >= 0) {
				return ({position:j, length:i});
			}
		}
		return 0;
	}

	FM.findIntersect = function(a, b) { //find longest intersecton of a and b
		bestResult = 0;
		for (i = 0; i < a.length; i++) {
			result = findIntersectFromStart(a.substring(i), b);
			if (result) {
				if (!bestResult) {
					bestResult = result;
				} else {
					if (result.length > bestResult.length) {
						bestResult = result;
					}
				}
			}
			if (bestResult && bestResult.length >= a.length-i)
				break;
		}
		return bestResult;
	} //return position of start and length of intersection


	FM.getNorm = function(word, pref, suf) { //get norm by word, prefix, suffix

	}

	FM.getPreSuf = function(word, norm) { //get suffix prefix by word and norm
		a = FM.findIntersectFromStart(word, norm);
		FM.pref = a['position'];
	}


	FM.keyParse = function($event, pole) {
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
			case '39':
			if (pole == 0) {
				FM.getCommon(FM.pred_corr);
				FM.our_norm = FM.norm;
			} 
			if (pole == 1) {
				FM.getCommon(FM.pred_same);
			}
			break;

			default:
			if (pole == 0) {
				//FM.our_norm = FM.norm;
				if (FM.pred_corr.length > 3) {
					FM.getCommon(FM.pred_corr);
				}
			} 
			if (pole == 1) {
				if (FM.pred_same.length > 3) {
					FM.getCommon(FM.pred_same);
				}
			}
			if (pole == 2) {
				if (FM.pred_corr.length > 3) {

				}
				FM.getPreSuf(FM.word, FM.norm);
				

			} 
		}
	}

	FM.loadInfo = function() {
		$http
		.post('/api.php', {'command': 'loadInfo'})
		.then(function(res) {
			FM.cur_id = res["data"][0];
			FM.sentence = " " + res["data"][1] + " "; /*магия as is*/ 
			FM.word = res["data"][2];

			FM.pred_same = res["data"][3];
			FM.pred_corr = res["data"][4];
			FM.sentence = FM.sentence.replace(" " + FM.word + " ", "<b> " + FM.word + " </b>");
			
			bestLogicIhatejs = FM.getCommon(FM.pred_corr);
			FM.our_norm = bestLogicIhatejs;
		}, function() {
			FM.error_status = "WTF";
		});	
	}

	FM.getCommon = function(word) {
		bestLogicIhatejs = "wtf";
		$http
		.post('/api.php', {'command': 'getCommon', 'word': word})
		.then(
			function(res) {
				FM.norm = res['data'][3];
				FM.gram = res['data'][2];
				bestLogicIhatejs = res['data'][3];
				bestLogicIhatejs = "11";
			},
			function() {
				FM.error_status = res["data"][1];
			}
		)
	}
	FM.saveToBaseAndDelete = function(id, word, corr, norm, gram) { //сохраняет обработанное слово и удаляет его из проблемных слов
		if (id !== "" && id !== "0") {
			$http
			.post('/api.php', {'command': 'saveToBaseAndDelete', 'id': id, 'word': word, 'corr': corr, 'norm': norm, 'gram': gram})
			.then(function(res) {
				FM.error_status = res["data"][0];
				FM.loadInfo();
				FM.in_word = "";
			}, function(res) {
				FM.error_status = res["data"][0];
				return 1;
			});
			return 0;
		} else {
			return 1;
		}
	}

	FM.saveCorrectExist = function() {
		if (!FM.saveToBaseAndDelete(FM.cur_id, FM.word, FM.pred_corr, FM.our_norm, FM.gram)) {
			FM.our_norm = "";
			FM.pred_same = "";
			FM.pred_corr = "";
			FM.norm = "";
			FM.gram = "";
			FM.loadInfo();
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
	FM.our_norm = FM.norm;
});