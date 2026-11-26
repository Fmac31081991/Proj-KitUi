@echo off
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel%==0 goto usa_node

where python >nul 2>nul
if %errorlevel%==0 goto usa_python

echo Node.js ou Python nao encontrados no PATH.
echo Instale um dos dois para abrir o Kit UI.
pause
exit /b

:usa_node
echo Iniciando o Kit UI. O navegador abrira automaticamente.
node servir.js
goto fim

:usa_python
echo Iniciando o servidor Python. O navegador abrira automaticamente.
python servir.py
goto fim

:fim
echo.
pause
