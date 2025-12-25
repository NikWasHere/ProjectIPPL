#!/bin/bash

# Smart Study Assistant - Auto Zip Script for Linux/Mac

echo "🚀 Starting zip process..."

# Project name
PROJECT_NAME="smart-study-assistant"
OUTPUT_FILE="${PROJECT_NAME}-$(date +%Y%m%d-%H%M%S).zip"

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📁 Project directory: $SCRIPT_DIR"
echo "💾 Output file: $OUTPUT_FILE"

# Create zip excluding unnecessary files
cd "$PARENT_DIR" || exit

zip -r "$OUTPUT_FILE" "$PROJECT_NAME" \
  -x "*/node_modules/*" \
  -x "*/.next/*" \
  -x "*/.git/*" \
  -x "*/dist/*" \
  -x "*/build/*" \
  -x "*/*.db" \
  -x "*/*.db-journal" \
  -x "*/.env" \
  -x "*/.env.local" \
  -x "*/coverage/*" \
  -x "*/.DS_Store" \
  -x "*/Thumbs.db"

echo "✅ Zip created successfully!"
echo "📦 File: $OUTPUT_FILE"
echo "📏 Size: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo ""
echo "Next steps:"
echo "1. Upload $OUTPUT_FILE to your server"
echo "2. Extract: unzip $OUTPUT_FILE"
echo "3. Follow DOCKER_DEPLOYMENT.md for deployment"
