@echo off
title WBGL - Otomatik Baslatma Ayari
color 0e

echo ==========================================
echo    BILGISAYAR ACILISINDA OTOMATIK BASLAT
echo ==========================================
echo.
echo Bu islem, Windows 'Baslangic' (Startup) klasorunuze 
echo start.bat dosyasinin minimal (simge durumunda kucultulmus) 
echo ozel bir kisayolunu ekleyecektir.
echo.
set /p "req=Aktif edilsin mi? (Y/N): "

if /i "%req%"=="Y" (
    set "SCRIPT_DIR=%~dp0"
    set "SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\WBGL_AutoStart.lnk"
    
    :: VBScript ile kisayol olusturma (Terminal penceresi gizli / minimize olarak ayarli)
    echo Set oWS = WScript.CreateObject^("WScript.Shell"^) > CreateShortcut.vbs
    echo sLinkFile = "!SHORTCUT_PATH!" >> CreateShortcut.vbs
    echo Set oLink = oWS.CreateShortcut^("%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\WBGL_AutoStart.lnk"^) >> CreateShortcut.vbs
    echo oLink.TargetPath = "%~dp0start.bat" >> CreateShortcut.vbs
    echo oLink.WorkingDirectory = "%~dp0" >> CreateShortcut.vbs
    echo oLink.Description = "Web-Based Gaming Library" >> CreateShortcut.vbs
    echo oLink.WindowStyle = 7 >> CreateShortcut.vbs
    echo oLink.Save >> CreateShortcut.vbs

    cscript /nologo CreateShortcut.vbs
    del CreateShortcut.vbs

    echo.
    echo [BASARILI] Uygulama baslangica eklendi! Bilgisayar acildiginda sunucu arka planda ^(minimize^) baslayacaktir.
    echo Iptal etmek isterseniz calistir kismina "shell:startup" yazip olusan dosyayi silebilirsiniz.
) else (
    echo.
    echo [IPTAL] Islem iptal edildi.
)

pause
