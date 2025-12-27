#!/usr/bin/env python3
"""
Script to convert recipe markdown files to structured JSON using Claude AI.
The AI will parse each recipe and extract:
- Recipe name (in Croatian)
- Ingredients list (in Croatian)
- Instructions/description (in Croatian)

Usage:
    python recipes_to_json.py                    # Process all recipes
    python recipes_to_json.py --limit 5          # Process only first 5 recipes (for testing)
    python recipes_to_json.py --output recipes.json
"""

import argparse
import json
import os
import re
from pathlib import Path
from anthropic import Anthropic


def clean_title_from_markdown(content):
    """Extract clean title from markdown content."""
    # Look for ## Title {#anchor}
    match = re.search(r'^##\s+(.+?)\s*\{#[^}]+\}', content, re.MULTILINE)
    if match:
        return match.group(1).strip()

    # Fallback: look for any ## heading
    match = re.search(r'^##\s+(.+?)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()

    return None


def parse_recipe_with_ai(client, recipe_content, recipe_filename):
    """Use Claude AI to parse a recipe into structured data."""

    prompt = f"""Analiziraj sljedeći recept i vrati podatke u JSON formatu. Recept je na hrvatskom jeziku i treba ostati na hrvatskom.

Recept:
{recipe_content}

Vrati JSON objekt sa sljedećom strukturom:
{{
  "name": "Ime recepta na hrvatskom",
  "ingredients": ["sastojak 1", "sastojak 2", ...],
  "instructions": "Detaljne upute za pripremu na hrvatskom"
}}

VAŽNO:
- Svi sastojci trebaju biti odvojeni u listu, svaki kao string
- Ako sastojci imaju količine (npr. "2 mrkve", "1 zlica ulja"), zadrži količine uz sastojak
- Upute trebaju biti jedan koherentan tekst koji opisuje kako napraviti recept
- Sve ostaje na hrvatskom jeziku
- Vrati SAMO JSON, bez dodatnog teksta

JSON:"""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=2000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        response_text = message.content[0].text.strip()

        # Try to extract JSON if there's extra text
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            response_text = json_match.group(0)

        recipe_data = json.loads(response_text)

        # Validate structure
        if not all(key in recipe_data for key in ['name', 'ingredients', 'instructions']):
            raise ValueError("Missing required keys in parsed recipe")

        return recipe_data

    except Exception as e:
        print(f"  ⚠️  Error parsing {recipe_filename}: {e}")
        return None


def process_recipes(recipes_dir, limit=None):
    """Process all recipe files and convert to JSON structure."""

    # Check for API key
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set!")
        print("\nTo use this script, you need an Anthropic API key:")
        print("1. Get your API key from: https://console.anthropic.com/settings/keys")
        print("2. Set it in your environment:")
        print("   export ANTHROPIC_API_KEY='your-api-key-here'")
        print("\n3. Then run the script again:")
        print("   source venv/bin/activate")
        print("   python recipes_to_json.py --pretty")
        print("\nAlternatively, you can use Claude Code to process recipes interactively.")
        return None

    client = Anthropic(api_key=api_key)

    recipes_path = Path(recipes_dir)
    if not recipes_path.exists():
        print(f"Error: Recipes directory '{recipes_dir}' not found!")
        return None

    # Get all markdown files
    recipe_files = sorted(recipes_path.glob('*.md'))

    if limit:
        recipe_files = recipe_files[:limit]
        print(f"Processing first {limit} recipes (limited)...")
    else:
        print(f"Processing all {len(recipe_files)} recipes...")

    print()

    recipes_json = []

    for idx, recipe_file in enumerate(recipe_files, 1):
        print(f"[{idx}/{len(recipe_files)}] Processing: {recipe_file.name}")

        # Read recipe content
        with open(recipe_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Parse with AI
        recipe_data = parse_recipe_with_ai(client, content, recipe_file.name)

        if recipe_data:
            recipes_json.append(recipe_data)
            print(f"  ✓ Parsed: {recipe_data['name']}")

        print()

    print("=" * 80)
    print(f"Successfully processed {len(recipes_json)}/{len(recipe_files)} recipes")
    print("=" * 80)

    return recipes_json


def main():
    parser = argparse.ArgumentParser(
        description='Convert recipe markdown files to structured JSON using AI',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument(
        '--recipes-dir',
        default='recipes',
        help='Directory containing recipe markdown files (default: recipes/)'
    )
    parser.add_argument(
        '--output',
        default='recipes.json',
        help='Output JSON file (default: recipes.json)'
    )
    parser.add_argument(
        '--limit',
        type=int,
        help='Limit number of recipes to process (for testing)'
    )
    parser.add_argument(
        '--pretty',
        action='store_true',
        help='Pretty print JSON output with indentation'
    )

    args = parser.parse_args()

    # Process recipes
    recipes_data = process_recipes(args.recipes_dir, args.limit)

    if recipes_data is None:
        return 1

    # Save to JSON file
    output_path = Path(args.output)

    with open(output_path, 'w', encoding='utf-8') as f:
        if args.pretty:
            json.dump(recipes_data, f, ensure_ascii=False, indent=2)
        else:
            json.dump(recipes_data, f, ensure_ascii=False)

    print()
    print(f"Saved {len(recipes_data)} recipes to: {output_path.absolute()}")
    print()

    # Show sample
    if recipes_data:
        print("Sample recipe:")
        print(json.dumps(recipes_data[0], ensure_ascii=False, indent=2))

    return 0


if __name__ == '__main__':
    exit(main())
