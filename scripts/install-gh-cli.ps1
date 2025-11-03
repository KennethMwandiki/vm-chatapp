# Attempt to install GitHub CLI via winget without elevation and report status
# Run in an elevated PowerShell if required: Right-click -> Run as Administrator
try {
  Write-Host "Attempting to install GitHub CLI via winget..."
  winget install --id GitHub.cli -e --source winget --accept-package-agreements --accept-source-agreements -h
  Write-Host "Install command issued. Check winget output for progress."
} catch {
  Write-Host "Install failed or was cancelled. Try running PowerShell as Administrator and run this script again." -ForegroundColor Yellow
}

Write-Host "Check if gh is available now:"
if (Get-Command gh -ErrorAction SilentlyContinue) {
  gh --version
} else {
  Write-Host "gh not found. Please install manually from https://cli.github.com/" -ForegroundColor Red
}
