# Update and push changes to the startup_frontend GitHub repository
# Remote URL: https://github.com/MuhammadShayanUmarX/startup_frontend.git

# Ensure we are in a git repo
if (!(Test-Path .git)) {
    git init
    git branch -M main
}

# Set the new remote URL
git remote remove origin 2>$null
git remote add origin https://github.com/MuhammadShayanUmarX/startup_frontend.git

# Stage and commit
git add .
git commit -m "first commit: push frontend code"

# Push to the new repo
git push -u origin main -f

Write-Host "`nSuccessfully pushed the updates to start_frontend repository!"
Write-Host "Please check your GitHub / Vercel dashboard for the deployment."
Write-Host "Press any key to exit..."
$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
