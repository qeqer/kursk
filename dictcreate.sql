CREATE DATABASE IF NOT EXISTS lingvo;
USE lingvo;
DROP TABLE IF EXISTS dictionary;
CREATE TABLE dictionary (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
	word TEXT) DEFAULT CHARACTER SET UTF8;
INSERT INTO dictionary(word) VALUES ("кок"), 
	("тип"), 
	("наша");
SELECT * FROM dictionary;
