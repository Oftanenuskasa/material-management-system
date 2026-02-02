#!/bin/bash
# This script helps fix the handleCreate function
echo "Looking for handleCreate function..."
find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "handleCreate" 2>/dev/null
