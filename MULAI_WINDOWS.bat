@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instal Node.js LTS gratis dari https://nodejs.org lalu buka file ini kembali.
  pause
  exit /b 1
)
echo Buka http://localhost:4173 di browser. Biarkan jendela ini tetap terbuka.
node server.mjs
pause
