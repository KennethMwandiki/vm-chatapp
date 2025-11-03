param(
  [string]$Repo = $env:GITHUB_REPOSITORY
)
if (-not $Repo) {
  Write-Host "Usage: publish-platform-secrets.ps1 -Repo owner/repo" -ForegroundColor Yellow
  exit 1
}

Write-Host "Publishing secrets to $Repo"
$AGORA_APP_ID = Read-Host "Enter AGORA_APP_ID"
$AGORA_CUSTOMER_SECRET = Read-Host -AsSecureString "Enter AGORA_CUSTOMER_SECRET"
$VERCEL_TOKEN = Read-Host "Enter VERCEL_TOKEN"
$GOOGLE_PLAY_JSON_PATH = Read-Host "Enter GOOGLE_PLAY_SERVICE_ACCOUNT_JSON (path)"
$ASC_ISSUER_ID = Read-Host "Enter APP_STORE_CONNECT_ISSUER_ID"
$ASC_KEY_PATH = Read-Host "Enter APP_STORE_CONNECT_PRIVATE_KEY (path)"
$DOCKERHUB_USER = Read-Host "Enter DOCKERHUB_USERNAME"
$DOCKERHUB_TOKEN = Read-Host -AsSecureString "Enter DOCKERHUB_TOKEN"
$SLACK_WEBHOOK_URL = Read-Host -AsSecureString "Enter SLACK_WEBHOOK_URL"

gh secret set AGORA_APP_ID --repo $Repo --body $AGORA_APP_ID
gh secret set AGORA_CUSTOMER_SECRET --repo $Repo --body (ConvertFrom-SecureString $AGORA_CUSTOMER_SECRET)
gh secret set VERCEL_TOKEN --repo $Repo --body $VERCEL_TOKEN
if (Test-Path $GOOGLE_PLAY_JSON_PATH) { gh secret set GOOGLE_PLAY_SERVICE_ACCOUNT_JSON --repo $Repo --body (Get-Content $GOOGLE_PLAY_JSON_PATH -Raw) }
if (Test-Path $ASC_KEY_PATH) { gh secret set APP_STORE_CONNECT_PRIVATE_KEY --repo $Repo --body (Get-Content $ASC_KEY_PATH -Raw) }
gh secret set APP_STORE_CONNECT_ISSUER_ID --repo $Repo --body $ASC_ISSUER_ID
gh secret set DOCKERHUB_USERNAME --repo $Repo --body $DOCKERHUB_USER
gh secret set DOCKERHUB_TOKEN --repo $Repo --body (ConvertFrom-SecureString $DOCKERHUB_TOKEN)
gh secret set SLACK_WEBHOOK_URL --repo $Repo --body (ConvertFrom-SecureString $SLACK_WEBHOOK_URL)

Write-Host "Secrets published. Verify with: gh secret list --repo $Repo"
