use mysql;
select * from user;
SET PASSWORD for 'root'@'localhost' ='1111';
select *from user;
FLUSH PRIVILEGES;