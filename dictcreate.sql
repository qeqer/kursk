CREATE DATABASE IF NOT EXISTS lingvo;
USE lingvo;
DROP TABLE IF EXISTS dictionary;
CREATE TABLE dictionary (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
	word VARCHAR(40), descript VARCHAR(40), norm VARCHAR(40), suf VARCHAR(40), pref VARCHAR(40)) DEFAULT CHARACTER SET UTF8;
INSERT INTO dictionary(word, descript, norm, suf, pref) VALUES ("кокса", "основа", "кокс", "нет", "нет");
INSERT INTO dictionary(word, descript, norm, suf, pref) VALUES ("кок", "основа", "кок", "нет", "нет");
SELECT * FROM dictionary;
