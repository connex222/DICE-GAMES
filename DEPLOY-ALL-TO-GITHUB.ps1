$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
Write-Host "POCKET GAMEBOX ALPHA - COMPLETE GITHUB UPLOAD" -ForegroundColor Cyan
Write-Host "Target: https://github.com/connex222/DICE-GAMES" -ForegroundColor Cyan

$expected=94
$audio=Join-Path $PSScriptRoot 'assets\audio'
New-Item -ItemType Directory -Force -Path $audio | Out-Null
$files=@(Get-ChildItem -Path $audio -Filter '*.mp3' -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -ge 1000 })
if ($files.Count -lt $expected) {
  Write-Host "Found $($files.Count) of $expected audio recordings. Downloading the missing media..." -ForegroundColor Yellow
  & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'INSTALL-NEW-SOUNDS.ps1')
}
$files=@(Get-ChildItem -Path $audio -Filter '*.mp3' -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -ge 1000 })
$missing=@()
$required=Get-Content -LiteralPath (Join-Path $PSScriptRoot 'REQUIRED-AUDIO-FILES.txt')
foreach($name in $required){ if(-not (Test-Path -LiteralPath (Join-Path $audio $name)) -or (Get-Item -LiteralPath (Join-Path $audio $name)).Length -lt 1000){$missing += $name} }
if ($missing.Count -gt 0) { throw "UPLOAD STOPPED: Missing $($missing.Count) audio files: $($missing -join ', '). No incomplete deployment was made." }
Write-Host "All $expected MP3 files verified." -ForegroundColor Green
if (-not (Get-Command git.exe -ErrorAction SilentlyContinue)) { throw 'Git for Windows is not installed. Install https://git-scm.com/downloads/win, then double-click this file again.' }
$repo='https://github.com/connex222/DICE-GAMES.git'
if (-not (Test-Path '.git')) { & git init; if($LASTEXITCODE -ne 0){throw 'git init failed'} }
$gitName = (& git config --get user.name 2>$null)
if (-not $gitName) { & git config user.name 'POCKET GAMEBOX' }
$gitEmail = (& git config --get user.email 2>$null)
if (-not $gitEmail) { & git config user.email 'pocket-gamebox@users.noreply.github.com' }
& git branch -M main
# A newly initialised repository has no 'origin' remote; that is normal.
$remotes = @(& git remote)
if ($remotes -contains 'origin') { & git remote set-url origin $repo } else { & git remote add origin $repo }
if ($LASTEXITCODE -ne 0) { throw 'Could not configure GitHub remote' }
& git add --all
if($LASTEXITCODE -ne 0){throw 'git add failed'}
& git diff --cached --quiet
if($LASTEXITCODE -ne 0) { & git commit -m 'Deploy POCKET GAMEBOX Alpha with complete artwork and 94 Creative Claw MP3 assets'; if($LASTEXITCODE -ne 0){throw 'git commit failed'} }
Write-Host 'Uploading to GitHub. A browser sign-in may open.' -ForegroundColor Yellow
& git push -u origin main
if ($LASTEXITCODE -ne 0) { throw 'GitHub push failed. Check the message above; do not force push.' }
Write-Host 'UPLOAD COMPLETE: https://github.com/connex222/DICE-GAMES' -ForegroundColor Green
