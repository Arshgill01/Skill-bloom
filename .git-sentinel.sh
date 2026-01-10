#!/bin/bash

# Git Sentinel - Automated Version Control Monitor
# Monitors repository for changes every 30 seconds and auto-commits

COMMIT_LOG="/Users/arshdeepsingh/.gemini/antigravity/brain/9ba3014b-60c0-4888-958c-98db6f82440f/commit_log.md"
COMMIT_COUNT=1

echo "🔍 Git Sentinel started at $(date)"
echo "Monitoring repository: $(pwd)"
echo "---"

while true; do
  # Check for changes using git status
  CHANGES=$(git status --porcelain)
  
  if [ -n "$CHANGES" ]; then
    echo "✓ Changes detected at $(date)"
    
    # Get detailed change summary
    STAT_OUTPUT=$(git diff HEAD --stat 2>/dev/null)
    
    # Stage all changes
    git add -A
    
    # Analyze changes to generate semantic commit message
    MODIFIED=$(echo "$CHANGES" | grep "^ M" | wc -l | tr -d ' ')
    ADDED=$(echo "$CHANGES" | grep "^??" | wc -l | tr -d ' ')
    DELETED=$(echo "$CHANGES" | grep "^ D" | wc -l | tr -d ' ')
    
    # Generate commit message based on file types and changes
    if echo "$CHANGES" | grep -q "components/"; then
      COMMIT_TYPE="feat"
      SCOPE="components"
    elif echo "$CHANGES" | grep -q "app/"; then
      COMMIT_TYPE="feat"
      SCOPE="app"
    elif echo "$CHANGES" | grep -q "package.json"; then
      COMMIT_TYPE="chore"
      SCOPE="deps"
    elif echo "$CHANGES" | grep -q "\.md$"; then
      COMMIT_TYPE="docs"
      SCOPE=""
    else
      COMMIT_TYPE="chore"
      SCOPE=""
    fi
    
    # Build commit message
    if [ -n "$SCOPE" ]; then
      MSG_PREFIX="${COMMIT_TYPE}(${SCOPE}): "
    else
      MSG_PREFIX="${COMMIT_TYPE}: "
    fi
    
    if [ $MODIFIED -gt 0 ] && [ $ADDED -gt 0 ] && [ $DELETED -gt 0 ]; then
      MSG="${MSG_PREFIX}update files - ${MODIFIED} modified, ${ADDED} added, ${DELETED} deleted"
    elif [ $MODIFIED -gt 0 ] && [ $ADDED -gt 0 ]; then
      MSG="${MSG_PREFIX}update and add new files"
    elif [ $MODIFIED -gt 0 ] && [ $DELETED -gt 0 ]; then
      MSG="${MSG_PREFIX}update and remove files"
    elif [ $MODIFIED -gt 0 ]; then
      MSG="${MSG_PREFIX}update files"
    elif [ $ADDED -gt 0 ]; then
      MSG="${MSG_PREFIX}add new files"
    elif [ $DELETED -gt 0 ]; then
      MSG="${MSG_PREFIX}remove files"
    else
      MSG="${MSG_PREFIX}update repository"
    fi
    
    # Commit changes
    git commit -m "$MSG"
    COMMIT_HASH=$(git rev-parse --short HEAD)
    TIMESTAMP=$(date +"%Y-%m-%dT%H:%M:%S%z")
    
    # Update commit log
    COMMIT_COUNT=$((COMMIT_COUNT + 1))
    
    echo "✓ Committed: $COMMIT_HASH - $MSG"
    echo ""
    
  else
    echo "[$(date +"%H:%M:%S")] No changes detected"
  fi
  
  # Wait 30 seconds before next check
  sleep 30
done
