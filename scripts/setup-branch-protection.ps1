param(
  [string]$Repo = $env:GITHUB_REPOSITORY,
  [string]$Branch = 'main'
)
if (-not $Repo) { Write-Host "Usage: setup-branch-protection.ps1 -Repo owner/repo [-Branch branch]"; exit 1 }

Write-Host "Setting branch protection for $Repo $Branch"

$body = @{
  required_status_checks = @{ strict = $true; contexts = @('build','lint','tests') }
  enforce_admins = $true
  required_pull_request_reviews = @{ dismiss_stale_reviews = $true; require_code_owner_reviews = $true; required_approving_review_count = 1 }
  restrictions = $null
} | ConvertTo-Json -Depth 6

gh api -X PUT "/repos/$Repo/branches/$Branch/protection" -F "$(ConvertTo-Json $body)"

Write-Host "Branch protection request sent. Review in repository settings -> Branches."
