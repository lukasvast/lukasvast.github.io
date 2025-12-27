#!/bin/bash
# Start the recipe browser server
#
# Usage:
#   ./start_server.sh        # Production mode (uses recipes.json)
#   ./start_server.sh --dev  # Development mode (uses recipes-dev.json)

cd "$(dirname "$0")"

echo "Setting up environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing dependencies..."
pip install -q -r requirements.txt

echo ""
python3 server.py "$@"
