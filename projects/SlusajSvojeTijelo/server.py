#!/usr/bin/env python3
"""
Flask server for recipe browser
Provides API endpoints to read and save recipes

Usage:
    python server.py          # Production mode (uses recipes.json)
    python server.py --dev    # Development mode (uses recipes-dev.json)
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import sys
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Determine which file to use based on mode
DEV_MODE = '--dev' in sys.argv
DATA_DIR = Path(__file__).parent / 'data'
RECIPES_FILE = DATA_DIR / ('recipes-dev.json' if DEV_MODE else 'recipes.json')


@app.route('/')
def index():
    """Serve the main HTML file"""
    return send_from_directory('.', 'recipe-browser.html')


@app.route('/edit.html')
def edit_page():
    """Serve the edit HTML file"""
    return send_from_directory('.', 'edit.html')


@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Serve static assets (CSS, JS, etc.)"""
    return send_from_directory('assets', filename)


@app.route('/api/recipes', methods=['GET'])
def get_recipes():
    """Get all recipes"""
    try:
        with open(RECIPES_FILE, 'r', encoding='utf-8') as f:
            recipes = json.load(f)
        return jsonify(recipes)
    except FileNotFoundError:
        return jsonify({'error': 'recipes.json not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/recipes', methods=['POST'])
def save_recipes():
    """Save all recipes"""
    try:
        recipes = request.json

        # Validate data
        if not isinstance(recipes, list):
            return jsonify({'error': 'Invalid data format'}), 400

        # Save to file
        with open(RECIPES_FILE, 'w', encoding='utf-8') as f:
            json.dump(recipes, f, ensure_ascii=False, indent=2)

        return jsonify({'success': True, 'message': 'Recepti spremljeni!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/recipes/<int:index>', methods=['PUT'])
def update_recipe(index):
    """Update a single recipe"""
    try:
        # Load current recipes
        with open(RECIPES_FILE, 'r', encoding='utf-8') as f:
            recipes = json.load(f)

        # Check index
        if index < 0 or index >= len(recipes):
            return jsonify({'error': 'Invalid recipe index'}), 400

        # Update recipe
        updated_recipe = request.json
        recipes[index] = updated_recipe

        # Save back
        with open(RECIPES_FILE, 'w', encoding='utf-8') as f:
            json.dump(recipes, f, ensure_ascii=False, indent=2)

        return jsonify({'success': True, 'message': 'Recept ažuriran!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    mode = "DEVELOPMENT" if DEV_MODE else "PRODUCTION"

    print("=" * 60)
    print(f"Recipe Browser Server [{mode} MODE]")
    print("=" * 60)
    print(f"Mode: {mode}")
    print(f"Recipes file: {RECIPES_FILE.absolute()}")
    print()

    if not RECIPES_FILE.exists():
        print(f"⚠️  Warning: {RECIPES_FILE.name} not found!")
        if DEV_MODE:
            print("   Creating empty dev file from recipes.json...")
            prod_file = DATA_DIR / 'recipes.json'
            if prod_file.exists():
                import shutil
                shutil.copy(prod_file, RECIPES_FILE)
                print(f"   ✓ Created {RECIPES_FILE.name}")
            else:
                print("   Creating empty recipes file...")
                DATA_DIR.mkdir(exist_ok=True)
                with open(RECIPES_FILE, 'w', encoding='utf-8') as f:
                    json.dump([], f)
                print(f"   ✓ Created empty {RECIPES_FILE.name}")
        print()

    print("Server running at: http://localhost:5555")
    print("Press Ctrl+C to stop")
    print("=" * 60)

    app.run(debug=True, host='0.0.0.0', port=5555)
