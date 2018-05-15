CREATE DATABASE IF NOT EXISTS lingvo;
USE lingvo;
DROP TABLE IF EXISTS problem_words;
CREATE TABLE problem_words (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, sentence TEXT, 
	origin VARCHAR(40), same_word VARCHAR(40) DEFAULT NULL, correct VARCHAR(40) DEFAULT NULL) DEFAULT CHARACTER SET utf8;
INSERT INTO problem_words(sentence, origin) VALUES ("кек кековый", "кек");
INSERT INTO problem_words(sentence, origin) VALUES ("она няша", "няша");
INSERT INTO problem_words(sentence, origin) VALUES ("топ мира", "топ");
SELECT * FROM problem_words;
