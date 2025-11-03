Param(
  [Parameter(Mandatory=$true)][string]$Owner,
  [Parameter(Mandatory=$true)][string]$Repo
)

# Usage: $env:GITHUB_TOKEN = "..."; .\check-secrets.ps1 -Owner user -Repo repo
$required = @("DOCKER_REGISTRY","DOCKER_USERNAME","DOCKER_PASSWORD","VERCEL_TOKEN","GOOGLE_PLAY_JSON_KEY","APP_STORE_CONNECT_API_KEY","SLACK_WEBHOOK_URL")
$missing = @()

foreach ($s in $required) {
  $url = "https://api.github.com/repos/$Owner/$Repo/actions/secrets/$s"
  $res = Invoke-RestMethod -Uri $url -Headers @{Authorization = "token $env:GITHUB_TOKEN"} -ErrorAction SilentlyContinue
  if (-not $res) { $missing += $s }
}

if ($missing.Count -gt 0) {
  Write-Host "Missing secrets: $($missing -join ', ')" -ForegroundColor Yellow
  exit 1
} else {
  Write-Host "All required secrets are present." -ForegroundColor Green
}
