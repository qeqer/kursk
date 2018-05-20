angular
.module('contr', ['ngSanitize'])
.controller('fillManager', function($http, $q) {
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
	FM.pref = "";
	FM.norm_suf = "";
	FM.norm_pref = "";

	FM.our_norm = "";
	FM.pred_corr = ""; //полученное из бд с исправленной ошибкой
	FM.pred_same = ""; //полученное из бд с похожим разбором

	FM.findIntersectFromStart = function(a, b) {//for findintersect, dont mind
		for (k = a.length; k > 0; k--) {
			d = a.substring(0,k);
			j = b.indexOf(d);
			if (j >= 0) {
				return ({position:j, length:k});
			}
		}
		return 0;
	}

	FM.findIntersect = function(a, b) { //find longest intersecton of a and b
		bestResult = 0;
		for (i = 0; i < a.length; i++) {
			result = FM.findIntersectFromStart(a.substring(i), b);
			if (result !== 0) {
				if (!bestResult) {
					bestResult = result;
				} else {
					if (result.length > bestResult.length) {
						bestResult = result;
					}
				}
			}
		}
		return bestResult;
	} //return position of start and length of intersection in second (b)


	FM.getPreSuf = function(word, norm) { //get suffixes prefixes by word and norm (FM.norm_*, FM.pref, FM.suf)
		a = FM.findIntersect(word, norm);
		if (a !== 0) {
			FM.norm_pref = norm.substring(0, a['position']);
			FM.norm_suf = norm.substring(a['position'] + a['length']);
			intersect = norm.substr(a['position'], a['length']);
			startIndex = word.indexOf(intersect);
			FM.pref = word.substring(0, startIndex);
			FM.suf = word.substring(startIndex + a['length']);
		}
		
	}


	FM.keyParse = function($event, pole) { //just small key controller, don't mind
		if ($event.type == "click") {
			if (pole == 0) {
				FM.getCommon(FM.pred_corr).then(function(resp) {
					FM.our_norm = FM.norm;
				}, function(resp) {
							
				});
				
			} 
			if (pole == 1) {
				FM.getCommon(FM.pred_same).then(function(resp) {
					FM.getPreSuf(FM.pred_same, FM.norm);
					//console.log(FM.pref + " " + FM.norm_pref + " " + FM.suf + " " + FM.norm_suf);
					FM.our_norm = FM.word.replace(FM.pref, FM.norm_pref).replace(FM.suf, FM.norm_suf);
				}, function(resp) {
							
				});
				
			}
		}
		switch ($event.keyCode + "") {
			case '39':
			if (pole == 0) {
				FM.getCommon(FM.pred_corr).then(function(resp) {
					FM.our_norm = FM.norm;
				}, function(resp) {
							
				});
				
			} 
			if (pole == 1) {
				FM.getCommon(FM.pred_same).then(function(resp) {
					FM.getPreSuf(FM.pred_same, FM.norm);
					//console.log(FM.pref + " " + FM.norm_pref + " " + FM.suf + " " + FM.norm_suf);
					FM.our_norm = FM.word.replace(FM.pref, FM.norm_pref).replace(FM.suf, FM.norm_suf);
				}, function(resp) {
							
				});
				
			}
			break;

			default:
				if (pole == 0) {
					if (FM.pred_corr.length > 3) {
						FM.getCommon(FM.pred_corr).then(function(resp) {
							FM.our_norm = FM.norm;
						}, function(resp) {
							
						});
					}
				} 
				if (pole == 1) {
					if (FM.pred_same.length > 3) {
						FM.getCommon(FM.pred_same).then(function(resp) {
							FM.getPreSuf(FM.pred_same, FM.norm);
							//console.log(FM.pref + " " + FM.norm_pref + " " + FM.suf + " " + FM.norm_suf);
							FM.our_norm = FM.word.replace(FM.pref, FM.norm_pref).replace(FM.suf, FM.norm_suf);
						}, function(resp) {

						}
						);
					}
				}
				break;
		}
	}

	FM.loadInfo = function(first) { //load info from database for every new word
		$http
		.post('/api.php', {'command': 'loadInfo'})
		.then(function(res) {
			FM.cur_id = res["data"][0];
			FM.sentence = " " + res["data"][1] + " "; /*магия as is*/ 
			FM.word = res["data"][2];
			if (res['data'][0] == "0") {
				FM.norm = "Слов нет";
				FM.gram = "Совсем";
				FM.our_norm = "Приходите завтра)";
			} else {
				FM.pred_same = res["data"][3];
				FM.pred_corr = res["data"][4];
				FM.sentence = FM.sentence.replace(" " + FM.word + " ", "<b> " + FM.word + " </b>");
				FM.getCommon(FM.pred_corr, first).then(function(resp) {}, function(resp) {});	
			}
			
		}, function(res) {
			FM.error_status = "WTF";
		});
	}

	FM.getCommon = function(word, first) { //get norm of the word by word. First is kostyl for first load
		var deferred = $q.defer();
		if (FM.cur_id == "0") {
			deferred.reject('Нет слов');
			return deferred.promise;
		}
		$http
		.post('/api.php', {'command': 'getCommon', 'word': word})
		.then(
			function(res) {

				FM.norm = res['data'][3];
				FM.gram = res['data'][2];
				if (FM.norm == "Похожих нет") {
					deferred.reject('Same not');
					FM.our_norm = FM.norm;
				}
				if (first == 1) {
					FM.our_norm = FM.norm;
				} else {
					FM.same_word = res['data'][1];	
				}
				deferred.resolve('Yeah');
			},
			function(res) {
				FM.error_status = res["data"][1];
			}
		)
		return deferred.promise;
	}
	FM.saveToBaseAndDelete = function(id, word, corr, norm, gram) { //сохраняет обработанное слово и удаляет его из проблемных слов
		var deferred = $q.defer();
		if (id !== "" && id !== "0") {
			$http
			.post('/api.php', {'command': 'saveToBaseAndDelete', 'id': id, 'word': word, 'corr': corr, 'norm': norm, 'gram': gram})
			.then(function(res) {
				FM.error_status = res["data"][0];
				FM.loadInfo();
				FM.in_word = "";
				deferred.resolve('All Ok');
			}, function(res) {
				FM.error_status = res["data"][0];
				deferred.reject('Not Ok');
			});
		} else {
			deferred.reject('Нету слова');
		}
		return deferred.promise;
	}

	FM.saveCorrectExist = function() {
		FM.saveToBaseAndDelete(FM.cur_id, FM.word, FM.pred_corr, FM.our_norm, FM.gram)
		.then(
			function(res) {
				FM.our_norm = "";
				FM.pred_same = "";
				FM.pred_corr = "";
				FM.norm = "";
				FM.gram = "";
				FM.loadInfo(1);
		}, function(res) {

		});
	}

	FM.saveCorrectNew = function() {
		FM.saveToBaseAndDelete(FM.cur_id, FM.word, FM.pred_corr, FM.our_norm, FM.gram)
		.then(
			function(res) {
				FM.our_norm = "";
				FM.pred_same = "";
				FM.pred_corr = "";
				FM.norm = "";
				FM.gram = "";
				FM.loadInfo(1);
		}, function(res) {

		});
	}

	FM.loadInfo(1);
});