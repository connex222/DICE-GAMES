$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"
$folder = Join-Path $PSScriptRoot "assets\audio"
New-Item -ItemType Directory -Force -Path $folder | Out-Null
$ok=0
$failed=@()
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
try {
  $path=Join-Path $folder "gilded-five.mp3"
  Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/956b9be2-e750-4360-9ff9-4b9659df99a8.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45
  if ((Get-Item $path).Length -lt 1000) { throw "Audio file is unexpectedly small" }
  Write-Host "OK gilded-five" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-five: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-five" }
try {
  $path=Join-Path $folder "brain-raid.mp3"
  Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/27f3e87c-912e-4a1a-a49d-62b2c34b29a3.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45
  if ((Get-Item $path).Length -lt 1000) { throw "Audio file is unexpectedly small" }
  Write-Host "OK brain-raid" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED brain-raid: $($_.Exception.Message)" -ForegroundColor Red; $failed += "brain-raid" }
try {
  $path=Join-Path $folder "shut-the-box.mp3"
  Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/fe79b19c-2ea2-476f-b7cf-85298e711f52.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45
  if ((Get-Item $path).Length -lt 1000) { throw "Audio file is unexpectedly small" }
  Write-Host "OK shut-the-box" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED shut-the-box: $($_.Exception.Message)" -ForegroundColor Red; $failed += "shut-the-box" }
try {
  $path=Join-Path $folder "liars-dice.mp3"
  Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/31807a5a-dd1f-410f-ab18-1241fe972410.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45
  if ((Get-Item $path).Length -lt 1000) { throw "Audio file is unexpectedly small" }
  Write-Host "OK liars-dice" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED liars-dice: $($_.Exception.Message)" -ForegroundColor Red; $failed += "liars-dice" }
try {
  $path=Join-Path $folder "bust-or-bank.mp3"
  Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/e48e0672-fff6-457f-88ab-4d7ef2628b83.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45
  if ((Get-Item $path).Length -lt 1000) { throw "Audio file is unexpectedly small" }
  Write-Host "OK bust-or-bank" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED bust-or-bank: $($_.Exception.Message)" -ForegroundColor Red; $failed += "bust-or-bank" }
try {
  $path=Join-Path $folder "generala.mp3"
  Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/34e5370f-a28c-4eb1-b2d8-2f6d03aa9129.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45
  if ((Get-Item $path).Length -lt 1000) { throw "Audio file is unexpectedly small" }
  Write-Host "OK generala" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED generala: $($_.Exception.Message)" -ForegroundColor Red; $failed += "generala" }
try {
  $path=Join-Path $folder "ten-of-a-kind.mp3"
  Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/9fc7c13f-c421-4781-8ae6-ac3be5d3c748.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45
  if ((Get-Item $path).Length -lt 1000) { throw "Audio file is unexpectedly small" }
  Write-Host "OK ten-of-a-kind" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED ten-of-a-kind: $($_.Exception.Message)" -ForegroundColor Red; $failed += "ten-of-a-kind" }
try {
  $path=Join-Path $folder "dice.mp3"
  Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/521b73ed-1c2b-4807-95cb-b752372c4ae1.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45
  if ((Get-Item $path).Length -lt 1000) { throw "Audio file is unexpectedly small" }
  Write-Host "OK dice" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED dice: $($_.Exception.Message)" -ForegroundColor Red; $failed += "dice" }
try {
  $path=Join-Path $folder "zombie.mp3"
  Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/c33c3410-b4b9-4360-a3fd-c77e591bbfc6.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45
  if ((Get-Item $path).Length -lt 1000) { throw "Audio file is unexpectedly small" }
  Write-Host "OK zombie" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED zombie: $($_.Exception.Message)" -ForegroundColor Red; $failed += "zombie" }

try {
  $path=Join-Path $folder "gilded-new-game.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/6f833888-1499-4c23-89ab-0ca86fdba4e2.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Download incomplete" }
  Write-Host "OK gilded-new-game" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-new-game: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-new-game" }

try {
  $path=Join-Path $folder "gilded-roll.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/8ebcbbcb-448a-4446-b44b-0b54771d5466.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Download incomplete" }
  Write-Host "OK gilded-roll" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-roll: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-roll" }

try {
  $path=Join-Path $folder "gilded-next-player.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/c2024934-0d09-4ab4-af1b-ca089cbe70c3.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Download incomplete" }
  Write-Host "OK gilded-next-player" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-next-player: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-next-player" }

try {
  $path=Join-Path $folder "gilded-big-score.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/4ef058fb-9aaf-4286-86fe-48507e2a83e2.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Download incomplete" }
  Write-Host "OK gilded-big-score" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-big-score: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-big-score" }

try {
  $path=Join-Path $folder "gilded-jackpot.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/657c06ee-2910-4bd5-8630-6ca5f39d30c7.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Download incomplete" }
  Write-Host "OK gilded-jackpot" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-jackpot: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-jackpot" }

try {
  $path=Join-Path $folder "gilded-bad-roll.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/b26e78d6-7482-42a8-8f44-d926ef1f798e.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Download incomplete" }
  Write-Host "OK gilded-bad-roll" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-bad-roll: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-bad-roll" }

try {
  $path=Join-Path $folder "gilded-final-round.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/dc5ca024-5d95-4952-9527-8ad1363467e7.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Download incomplete" }
  Write-Host "OK gilded-final-round" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-final-round: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-final-round" }

try {
  $path=Join-Path $folder "gilded-winner.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/7879d805-15c3-4f8e-aa5d-ad463985b9c4.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Download incomplete" }
  Write-Host "OK gilded-winner" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-winner: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-winner" }

try {
  $path=Join-Path $folder "gilded-record.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/76b7a3e3-f08a-4f49-92a4-1f7054ea652b.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Download incomplete" }
  Write-Host "OK gilded-record" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-record: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-record" }

try {
  $path=Join-Path $folder "gilded-game-over.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/b7973cb6-df8c-447d-b8cf-32137c079566.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Download incomplete" }
  Write-Host "OK gilded-game-over" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-game-over: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-game-over" }

try {
  $path=Join-Path $folder "brain-brains.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/87006ee6-30c1-4046-8962-0b2c3c3b08c7.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK brain-brains" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED brain-brains: $($_.Exception.Message)" -ForegroundColor Red; $failed += "brain-brains" }

try {
  $path=Join-Path $folder "brain-shotgun.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/8833c626-07da-4e0e-89f7-aabb94e0d29e.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK brain-shotgun" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED brain-shotgun: $($_.Exception.Message)" -ForegroundColor Red; $failed += "brain-shotgun" }

try {
  $path=Join-Path $folder "brain-bust.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/59af4aa3-9244-407b-b433-7e775e5345b2.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK brain-bust" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED brain-bust: $($_.Exception.Message)" -ForegroundColor Red; $failed += "brain-bust" }

try {
  $path=Join-Path $folder "brain-bank.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/7b2d3bb0-126e-4ce2-979c-ebe78e954a35.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK brain-bank" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED brain-bank: $($_.Exception.Message)" -ForegroundColor Red; $failed += "brain-bank" }

try {
  $path=Join-Path $folder "brain-roll.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/8db0128d-0bd1-46ec-8bb0-6cbfa8cd4f3d.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK brain-roll" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED brain-roll: $($_.Exception.Message)" -ForegroundColor Red; $failed += "brain-roll" }

try {
  $path=Join-Path $folder "brain-genius.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/3ec4e5b8-d4e6-4d23-9273-505eab8ffced.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK brain-genius" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED brain-genius: $($_.Exception.Message)" -ForegroundColor Red; $failed += "brain-genius" }

try {
  $path=Join-Path $folder "brain-last-round.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/ea1c90aa-2ff1-46f2-81c6-4788c7b74fec.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK brain-last-round" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED brain-last-round: $($_.Exception.Message)" -ForegroundColor Red; $failed += "brain-last-round" }

try {
  $path=Join-Path $folder "brain-winner.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/801ce4f1-af3b-4719-96d8-fe586b61ed12.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK brain-winner" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED brain-winner: $($_.Exception.Message)" -ForegroundColor Red; $failed += "brain-winner" }

try {
  $path=Join-Path $folder "brain-bomb.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/8b4fa19f-580d-44f0-b389-626c3c85bd8c.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK brain-bomb" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED brain-bomb: $($_.Exception.Message)" -ForegroundColor Red; $failed += "brain-bomb" }

try {
  $path=Join-Path $folder "brain-lucky.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/4fb8ab51-8df0-44e3-9f41-e921ba97d98f.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK brain-lucky" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED brain-lucky: $($_.Exception.Message)" -ForegroundColor Red; $failed += "brain-lucky" }

try {
  $path=Join-Path $folder "gilded-roll-b.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/51c060ed-bb24-4f1a-aaa2-7098b0bed754.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK gilded-roll-b" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-roll-b: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-roll-b" }

try {
  $path=Join-Path $folder "gilded-roll-c.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/3e179f72-e343-4683-9da3-e28926aca249.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK gilded-roll-c" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-roll-c: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-roll-c" }

try {
  $path=Join-Path $folder "gilded-turn-b.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/5ffbaae9-09b4-45fd-88b2-1ee39af59954.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK gilded-turn-b" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-turn-b: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-turn-b" }

try {
  $path=Join-Path $folder "gilded-turn-c.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/b26676ab-c5e2-4e19-9437-f0cc3c96eccd.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK gilded-turn-c" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-turn-c: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-turn-c" }

try {
  $path=Join-Path $folder "gilded-jackpot-b.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/72f9c821-8c70-4755-af4d-994cca7b225e.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK gilded-jackpot-b" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-jackpot-b: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-jackpot-b" }

try {
  $path=Join-Path $folder "gilded-jackpot-c.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/7392a2a8-e3ac-4408-b22c-32601e4b7077.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK gilded-jackpot-c" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gilded-jackpot-c: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gilded-jackpot-c" }
try {
  $path=Join-Path $folder "zombie-shotgun-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/e7f4864f-a5df-4b0d-8bbc-cea6d18fde58.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK zombie-shotgun-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED zombie-shotgun-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "zombie-shotgun-fx" }
try {
  $path=Join-Path $folder "zombie-brain-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/c91004d2-d9cb-4890-845c-0e62d41686f2.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK zombie-brain-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED zombie-brain-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "zombie-brain-fx" }
try {
  $path=Join-Path $folder "zombie-bust-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/eb972b47-8127-4e74-a1a8-80520c0a7dfc.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK zombie-bust-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED zombie-bust-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "zombie-bust-fx" }
try {
  $path=Join-Path $folder "zombie-bank-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/568f43b2-e9da-4d59-88e7-64c5fdcfb03c.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK zombie-bank-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED zombie-bank-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "zombie-bank-fx" }
try {
  $path=Join-Path $folder "zombie-dice-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/d4e2d596-4c87-4d21-be2d-e632a43eac37.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK zombie-dice-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED zombie-dice-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "zombie-dice-fx" }
try {
  $path=Join-Path $folder "zombie-victory-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/d5344eaa-9a1d-4feb-8e38-bb0653983f0b.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK zombie-victory-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED zombie-victory-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "zombie-victory-fx" }

try {
  $path=Join-Path $folder "shut-start.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/18235d66-12c1-4ea8-886a-9968bb0ef11f.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK shut-start" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED shut-start: $($_.Exception.Message)" -ForegroundColor Red; $failed += "shut-start" }

try {
  $path=Join-Path $folder "shut-roll.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/130ec207-e94a-4472-82c9-269fdf88f2cd.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK shut-roll" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED shut-roll: $($_.Exception.Message)" -ForegroundColor Red; $failed += "shut-roll" }

try {
  $path=Join-Path $folder "shut-tile.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/a5acbefa-2b01-4a35-9a56-6594a74f418f.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK shut-tile" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED shut-tile: $($_.Exception.Message)" -ForegroundColor Red; $failed += "shut-tile" }

try {
  $path=Join-Path $folder "shut-no-move.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/ca61d44a-b1c1-46cb-9a7b-16323e404950.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK shut-no-move" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED shut-no-move: $($_.Exception.Message)" -ForegroundColor Red; $failed += "shut-no-move" }

try {
  $path=Join-Path $folder "shut-victory.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/6c6ad9af-7a60-4028-aef9-fa5ad1c09fcf.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK shut-victory" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED shut-victory: $($_.Exception.Message)" -ForegroundColor Red; $failed += "shut-victory" }

try {
  $path=Join-Path $folder "shut-dice-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/a99beadd-56d0-4db1-8f04-9c5c69536f65.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK shut-dice-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED shut-dice-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "shut-dice-fx" }

try {
  $path=Join-Path $folder "shut-tile-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/0d0e76c3-f516-41e4-9a67-e2ec2217a178.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK shut-tile-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED shut-tile-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "shut-tile-fx" }

try {
  $path=Join-Path $folder "shut-victory-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/51c214e0-da4e-4abf-ada0-184d034dbadf.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete audio" }
  Write-Host "OK shut-victory-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED shut-victory-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "shut-victory-fx" }

try {
  $path=Join-Path $folder "liar-start.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/0554d9c0-c4cd-40a8-a0db-d85880871e5a.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK liar-start" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED liar-start: $($_.Exception.Message)" -ForegroundColor Red; $failed += "liar-start" }

try {
  $path=Join-Path $folder "liar-shake.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/479ff214-4718-4916-b24e-918a10933f89.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK liar-shake" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED liar-shake: $($_.Exception.Message)" -ForegroundColor Red; $failed += "liar-shake" }

try {
  $path=Join-Path $folder "liar-bid.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/dcac9855-11b4-4f0d-8179-4a1a86b7f58b.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK liar-bid" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED liar-bid: $($_.Exception.Message)" -ForegroundColor Red; $failed += "liar-bid" }

try {
  $path=Join-Path $folder "liar-raise.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/fd162dbf-063b-4f7a-8d1c-c16d4b600c6d.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK liar-raise" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED liar-raise: $($_.Exception.Message)" -ForegroundColor Red; $failed += "liar-raise" }

try {
  $path=Join-Path $folder "liar-challenge.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/e445d906-4ffe-471e-97d7-f8069fbc5e2c.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK liar-challenge" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED liar-challenge: $($_.Exception.Message)" -ForegroundColor Red; $failed += "liar-challenge" }

try {
  $path=Join-Path $folder "liar-reveal.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/18b2de98-3e5d-462c-80dc-d9b0f57eda31.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK liar-reveal" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED liar-reveal: $($_.Exception.Message)" -ForegroundColor Red; $failed += "liar-reveal" }

try {
  $path=Join-Path $folder "liar-winner.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/0f139374-aa18-4a7b-abd5-817a4a341bd2.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK liar-winner" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED liar-winner: $($_.Exception.Message)" -ForegroundColor Red; $failed += "liar-winner" }

try {
  $path=Join-Path $folder "liar-cup-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/3d503b70-c0bc-4e3a-b89a-ebcbb71761f4.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK liar-cup-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED liar-cup-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "liar-cup-fx" }

try {
  $path=Join-Path $folder "liar-slam-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/2e83828b-cd08-4002-a2fe-bf179fe17923.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK liar-slam-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED liar-slam-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "liar-slam-fx" }

try {
  $path=Join-Path $folder "liar-reveal-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/09963d9f-5dd3-4c1a-a8ea-3744624941ba.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK liar-reveal-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED liar-reveal-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "liar-reveal-fx" }

try {
  $path=Join-Path $folder "liar-win-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/7a264de9-a0b3-42ad-b413-84951ff67611.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK liar-win-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED liar-win-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "liar-win-fx" }

try {
  $path=Join-Path $folder "bust-start.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/573012bb-d93c-4e62-a94e-b719145f1a74.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK bust-start" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED bust-start: $($_.Exception.Message)" -ForegroundColor Red; $failed += "bust-start" }

try {
  $path=Join-Path $folder "bust-roll.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/56f5a4cc-6941-4253-a11c-f5484cb22520.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK bust-roll" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED bust-roll: $($_.Exception.Message)" -ForegroundColor Red; $failed += "bust-roll" }

try {
  $path=Join-Path $folder "bust-risk.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/629226b9-e88e-43fb-87aa-8b980363df69.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK bust-risk" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED bust-risk: $($_.Exception.Message)" -ForegroundColor Red; $failed += "bust-risk" }

try {
  $path=Join-Path $folder "bust-big.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/e1b72184-099c-44f6-b351-22652e689222.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK bust-big" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED bust-big: $($_.Exception.Message)" -ForegroundColor Red; $failed += "bust-big" }

try {
  $path=Join-Path $folder "bust-bank.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/0d87a2b9-4635-4a89-b36d-0f341346dbc3.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK bust-bank" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED bust-bank: $($_.Exception.Message)" -ForegroundColor Red; $failed += "bust-bank" }

try {
  $path=Join-Path $folder "bust-bust.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/906cf46d-85f4-4d48-b103-9e8d3a8ec2d4.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK bust-bust" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED bust-bust: $($_.Exception.Message)" -ForegroundColor Red; $failed += "bust-bust" }

try {
  $path=Join-Path $folder "bust-win.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/66791744-18bc-4634-adb4-64f1e17fd71f.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK bust-win" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED bust-win: $($_.Exception.Message)" -ForegroundColor Red; $failed += "bust-win" }

try {
  $path=Join-Path $folder "bust-rocket-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/196a4721-a8fa-4d9e-9d08-59a490c6abdc.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK bust-rocket-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED bust-rocket-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "bust-rocket-fx" }

try {
  $path=Join-Path $folder "bust-dice-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/22d83629-46d2-44b0-b574-3957edd92b57.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK bust-dice-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED bust-dice-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "bust-dice-fx" }

try {
  $path=Join-Path $folder "bust-tension-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/2527cc74-4048-46dc-ba23-7747789fd435.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK bust-tension-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED bust-tension-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "bust-tension-fx" }

try {
  $path=Join-Path $folder "bust-bank-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/5b9fccc8-5f8d-43f3-971c-d989565dc9ac.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK bust-bank-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED bust-bank-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "bust-bank-fx" }

try {
  $path=Join-Path $folder "bust-bust-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/4a702300-2ea0-4864-b6ce-79e70905bc09.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK bust-bust-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED bust-bust-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "bust-bust-fx" }

try {
  $path=Join-Path $folder "gen-start.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/da7ab91e-f9d2-4f6f-b6dd-e75d777dc857.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK gen-start" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gen-start: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gen-start" }

try {
  $path=Join-Path $folder "gen-roll.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/983d5f42-4d01-4ac3-a2b5-8ecc820f0d3e.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK gen-roll" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gen-roll: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gen-roll" }

try {
  $path=Join-Path $folder "gen-hold.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/a9188223-21b0-4911-b4f0-84c1f2d39bb5.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK gen-hold" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gen-hold: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gen-hold" }

try {
  $path=Join-Path $folder "gen-combo.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/58f0e22f-6d7b-47fa-a784-229e12931876.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK gen-combo" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gen-combo: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gen-combo" }

try {
  $path=Join-Path $folder "gen-serv.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/7feadd28-a8d3-416f-9c00-2556aaa07db7.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK gen-serv" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gen-serv: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gen-serv" }

try {
  $path=Join-Path $folder "gen-generala.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/982e8d74-da8c-4bc3-9308-19b702d71934.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK gen-generala" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gen-generala: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gen-generala" }

try {
  $path=Join-Path $folder "gen-win.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/57cbefc3-f966-493c-a3c6-7616642af37d.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK gen-win" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gen-win: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gen-win" }

try {
  $path=Join-Path $folder "gen-dice-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/bf497f03-b4c8-407c-b59f-bb037c0f8867.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK gen-dice-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gen-dice-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gen-dice-fx" }

try {
  $path=Join-Path $folder "gen-hold-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/b46f7605-ff3b-40e3-acf6-0bb2829d6d61.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK gen-hold-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gen-hold-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gen-hold-fx" }

try {
  $path=Join-Path $folder "gen-combo-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/27bfc32e-cc41-425c-9e57-b963340df44a.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK gen-combo-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gen-combo-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gen-combo-fx" }

try {
  $path=Join-Path $folder "gen-victory-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/ce428d73-1171-455f-a48d-e3729219ec67.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK gen-victory-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED gen-victory-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "gen-victory-fx" }

try {
  $path=Join-Path $folder "ten-start.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/4312962c-9a29-4aca-a851-d4cd53e27400.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK ten-start" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED ten-start: $($_.Exception.Message)" -ForegroundColor Red; $failed += "ten-start" }

try {
  $path=Join-Path $folder "ten-roll.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/0dbc6763-6494-4a7f-ad61-1b0e1c522b5f.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK ten-roll" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED ten-roll: $($_.Exception.Message)" -ForegroundColor Red; $failed += "ten-roll" }

try {
  $path=Join-Path $folder "ten-lock.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/7a7591b7-0eb0-4145-b0c2-3021e401f921.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK ten-lock" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED ten-lock: $($_.Exception.Message)" -ForegroundColor Red; $failed += "ten-lock" }

try {
  $path=Join-Path $folder "ten-combo.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/13d1ee1b-f97f-4b29-8675-3c9415de2c4c.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK ten-combo" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED ten-combo: $($_.Exception.Message)" -ForegroundColor Red; $failed += "ten-combo" }

try {
  $path=Join-Path $folder "ten-near.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/24ee9759-14ee-4fc6-b253-04e0561847b5.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK ten-near" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED ten-near: $($_.Exception.Message)" -ForegroundColor Red; $failed += "ten-near" }

try {
  $path=Join-Path $folder "ten-perfect.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/ea12ad5f-e0fb-4ad7-9257-bd02a483fa9c.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK ten-perfect" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED ten-perfect: $($_.Exception.Message)" -ForegroundColor Red; $failed += "ten-perfect" }

try {
  $path=Join-Path $folder "ten-win.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/c49390eb-2fb4-4413-818b-dbc0e7f27faa.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK ten-win" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED ten-win: $($_.Exception.Message)" -ForegroundColor Red; $failed += "ten-win" }

try {
  $path=Join-Path $folder "ten-dice-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/d2f25b71-40b5-45fd-96dc-a572d241d3ab.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK ten-dice-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED ten-dice-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "ten-dice-fx" }

try {
  $path=Join-Path $folder "ten-lock-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/8483cbb6-1f2c-49e8-a47e-95d186bc80f0.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK ten-lock-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED ten-lock-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "ten-lock-fx" }

try {
  $path=Join-Path $folder "ten-combo-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/d50dd214-072a-4b82-a6b4-8d59ac8f4337.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK ten-combo-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED ten-combo-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "ten-combo-fx" }

try {
  $path=Join-Path $folder "ten-perfect-fx.mp3"
  if (-not (Test-Path $path) -or (Get-Item $path).Length -lt 1000) {
    Invoke-WebRequest -Uri "https://cdn.creativeclaw.co/u/049bef39/audio/0b1bcd45-3052-4b12-bcfc-45dc410ffb8c.mp3" -OutFile $path -UseBasicParsing -TimeoutSec 45 -ErrorAction Stop
  }
  if ((Get-Item $path).Length -lt 1000) { throw "Incomplete" }
  Write-Host "OK ten-perfect-fx" -ForegroundColor Green; $ok++
} catch { Write-Host "FAILED ten-perfect-fx: $($_.Exception.Message)" -ForegroundColor Red; $failed += "ten-perfect-fx" }
Write-Host ""
Write-Host "$ok / 94 Creative Claw audio assets installed"
if ($failed.Count -gt 0) { Write-Host "Missing: $($failed -join ', ')" -ForegroundColor Yellow }
if ($failed.Count -eq 0) { Write-Host "SUCCESS - all 7 games' expanded audio packs installed." -ForegroundColor Green }
Read-Host "Press Enter to close"
