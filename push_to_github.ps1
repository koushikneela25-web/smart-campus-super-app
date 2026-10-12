param(
    [string]$Token = ""
)

$gitPath = "C:\Users\koush\.gemini\antigravity-ide\scratch\mingit\cmd\git.exe"
if (-not (Test-Path $gitPath)) {
    $gitPath = "git"
}

$repoDir = $PSScriptRoot

if ($Token) {
    Write-Host "Pushing to GitHub using Personal Access Token..." -ForegroundColor Cyan
    & $gitPath -C $repoDir push -u "https://$($Token)@github.com/koushikneela25-web/smart-campus-super-app.git" main
} else {
    Write-Host "Pushing to GitHub origin main..." -ForegroundColor Cyan
    Write-Host "Please complete the authentication prompt if required." -ForegroundColor Yellow
    & $gitPath -C $repoDir push -u origin main
}
