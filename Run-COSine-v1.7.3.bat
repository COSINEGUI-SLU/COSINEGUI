@echo off
setlocal
cd /d "%~dp0"
where java >nul 2>nul
if not errorlevel 1 (
  echo Starting COSine v1.7.3 with the Java installed on this computer...
  java -jar "COSine-v1.7.3.jar"
  if not errorlevel 1 exit /b 0
  echo.
  echo The installed Java could not start COSine. Trying the bundled runtime...
)
if exist "runtime\jre17\bin\java.exe" (
  "runtime\jre17\bin\java.exe" -jar "COSine-v1.7.3.jar"
  if not errorlevel 1 exit /b 0
)
echo.
echo COSine could not start.
echo If Windows reports that awt.dll access is denied:
echo   1. Move this entire folder outside OneDrive, for example to C:\COSine-v1.7.3
echo   2. Right-click the downloaded ZIP, choose Properties, select Unblock, and extract again
echo   3. Or install Java 17 and run: java -jar COSine-v1.7.3.jar
pause
exit /b 1
endlocal
