@echo off
REM Nang quyen mot user tu STUDENT len ADMIN.
REM Cach dung: scripts\make-admin.bat email@example.com

if "%~1"=="" (
    echo Cach dung: scripts\make-admin.bat email@example.com
    exit /b 1
)

set MYSQL_EXE="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

%MYSQL_EXE% -u nihongo -p123456 nihongoflow -e "UPDATE users SET role='ADMIN' WHERE email='%~1';"
%MYSQL_EXE% -u nihongo -p123456 nihongoflow -e "SELECT id, email, role FROM users WHERE email='%~1';"

echo.
echo Da cap nhat xong. Dang xuat va dang nhap lai tai khoan tren frontend de nhan quyen ADMIN moi.
