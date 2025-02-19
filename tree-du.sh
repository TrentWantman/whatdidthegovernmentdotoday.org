find . -type d \( -name "node_modules" -o -name ".git" -o -name ".vscode" \) -prune -o -exec du -sh {} + | sort -h

