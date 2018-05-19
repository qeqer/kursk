CREATE DATABASE IF NOT EXISTS lingvo;
USE lingvo;
DROP TABLE IF EXISTS problem_words;
CREATE TABLE problem_words (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, sentence TEXT, 
	origin VARCHAR(40), 
    pred_same VARCHAR(40) DEFAULT NULL, pred_corr VARCHAR(40) DEFAULT NULL) DEFAULT CHARACTER SET utf8;
INSERT INTO problem_words(sentence, origin, pred_same, pred_corr) VALUES ("настольнцй ночник", "настольнцй", "напольный", "настольный");
INSERT INTO problem_words(sentence, origin, pred_same, pred_corr) VALUES ("нету няши", "няши", "каши", "наша");
SELECT * FROM problem_words;
