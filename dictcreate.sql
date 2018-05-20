CREATE DATABASE IF NOT EXISTS lingvo;
USE lingvo;
DROP TABLE IF EXISTS dictionary;
CREATE TABLE dictionary (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
	word VARCHAR(40), descript VARCHAR(40), norm VARCHAR(40)) DEFAULT CHARACTER SET UTF8;
INSERT INTO dictionary(word, descript, norm) VALUES ("каши", "сущ", "каша");
INSERT INTO dictionary(word, descript, norm) VALUES ("кокса", "сущ", "кокс");
INSERT INTO dictionary(word, descript, norm) VALUES ("подпольная", "прилаг", "напольный");
INSERT INTO dictionary(word, descript, norm) VALUES ("настольный", "прилаг", "настольный");
SELECT * FROM dictionary;
