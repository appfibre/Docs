@ECHO OFF
@REM Temporary measure to update docs while developing app framework

SET OP=%1
IF "%OP%"=="" SET OP=/i

call :link cdn ..\node\local-cdn
call :link scripts\webapp ..\node\webapp\dist

GOTO:eof




:REMOVELINK
IF NOT EXIST %1 GOTO:eof
IF /I "%OP%"=="/u" ECHO removing %1
fsutil reparsepoint query "%1" | find "Symbolic Link" >nul && rd %1 
fsutil reparsepoint query "%1" | find "The file or directory is not a reparse point" >nul && (rmdir /Q/S %1)
GOTO:eof

:CREATELINK
mklink /d %1 %2
GOTO:eof

:RESTOREDIR
MD %1
XCOPY /E/Q %2 %1 >NUL
GOTO:eof

:LINK
IF /I "%OP%"=="i" call :removelink %~f1
IF /I "%OP%"=="/i" call :removelink %~f1
IF /I "%OP%"=="u" call :removelink %~f1
IF /I "%OP%"=="/u" call :removelink %~f1

IF /I "%OP%"=="i" call :createlink %~f1 %~f2
IF /I "%OP%"=="/i" call :createlink %~f1 %~f2
IF /I "%OP%"=="u" call :restoredir %~f1 %~f2
IF /I "%OP%"=="/u" call :restoredir %~f1 %~f2
GOTO:eof
