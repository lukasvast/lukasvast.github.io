#!/bin/bash
# Script to enhance recipe instructions using AI

set -e

# Change to project root directory (parent of scripts/)
cd "$(dirname "$0")/.."

echo "=========================================="
echo "Recipe Enhancement Script"
echo "=========================================="

echo ""
echo "Setting up environment..."
if [ ! -d "venv" ]; then
    echo "  Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    echo "  Installing dependencies..."
    pip install -q anthropic
else
    source venv/bin/activate
fi

echo ""
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "Enter your Anthropic API key:"
    echo "(Get it from: https://console.anthropic.com/settings/keys)"
    read -r ANTHROPIC_API_KEY
    export ANTHROPIC_API_KEY
fi

echo ""
echo "This script will enhance recipe instructions to make them clearer."
echo "Enhanced recipes will be saved to a new file with -enhanced suffix."
echo ""
echo "Select which file to process:"
echo "  1) recipes-dev.json → recipes-dev-enhanced.json"
echo "  2) recipes.json → recipes-enhanced.json"
echo ""
read -p "Your choice [1/2] (default: 1): " choice
choice=${choice:-1}

echo ""
read -p "Limit number of recipes? (press Enter for all, or type a number like 5): " limit

LIMIT_ARG=""
if [ -n "$limit" ] && [ "$limit" -gt 0 ] 2>/dev/null; then
    LIMIT_ARG="--limit $limit"
    echo "Will process first $limit recipes"
fi

if [ "$choice" = "2" ]; then
    echo ""
    echo "Processing recipes.json..."
    if [ -z "$limit" ]; then
        echo "This will process all 122 recipes and may take a while."
    fi
    read -p "Continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Cancelled."
        exit 0
    fi
    python3 scripts/enhance_recipes.py --input data/recipes.json --output data/recipes-enhanced.json $LIMIT_ARG
    OUTPUT_FILE="data/recipes-enhanced.json"
else
    echo ""
    echo "Processing recipes-dev.json..."
    python3 scripts/enhance_recipes.py --input data/recipes-dev.json --output data/recipes-dev-enhanced.json $LIMIT_ARG
    OUTPUT_FILE="data/recipes-dev-enhanced.json"
fi

echo ""
echo "=========================================="
echo "✓ Done!"
echo "Enhanced recipes saved to: $OUTPUT_FILE"
echo "=========================================="
