use mysql;
select * from user;
UPDATE user SET authentication_string = PASSWORD("2912") WHERE User = "root";
FLUSH PRIVILEGES;