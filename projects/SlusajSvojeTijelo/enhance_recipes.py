#!/usr/bin/env python3
"""
Enhance recipes by improving instructions for clarity.
This script processes each recipe and uses AI to make instructions more clear and actionable.
"""

import json
import os
import sys
from anthropic import Anthropic

# Configurable prompt for recipe enhancement
ENHANCEMENT_PROMPT = """You are a professional recipe editor. Your task is to improve the cooking instructions to make them clearer and easier to follow.

Given recipe name: {name}
Given ingredients:
{ingredients}

Current instructions:
{instructions}

Please rewrite the instructions to be:
1. Clear and step-by-step
2. More specific about cooking techniques (e.g., "prodinstati" should be explained as "sauté" or "fry until translucent")
3. Include approximate times where helpful
4. Better formatted with clear steps
5. Keep the same language (Croatian) and tone
6. Don't add ingredients that aren't in the list
7. Make sure each step is actionable and clear

Return ONLY the improved instructions text, nothing else. No preamble, no explanation, just the instructions."""

def enhance_instructions(client, recipe):
    """Use AI to enhance recipe instructions."""

    # Format ingredients as a numbered list
    ingredients_text = "\n".join(f"{i+1}. {ing}" for i, ing in enumerate(recipe['ingredients']))

    # Create the prompt
    prompt = ENHANCEMENT_PROMPT.format(
        name=recipe['name'],
        ingredients=ingredients_text,
        instructions=recipe['instructions']
    )

    try:
        # Call Claude API
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=2000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Extract the enhanced instructions
        enhanced = message.content[0].text.strip()
        return enhanced

    except Exception as e:
        print(f"  ⚠️  Error enhancing recipe: {e}")
        print(f"  Error details: {type(e).__name__}")
        return recipe['instructions']  # Return original on error

def process_recipes(input_file='recipes.json', output_file=None, dry_run=False):
    """Process all recipes and enhance their instructions."""

    if output_file is None:
        # Default: save to a new file with -enhanced suffix
        base_name = input_file.rsplit('.', 1)[0]
        output_file = f"{base_name}-enhanced.json"

    # Check for API key
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set")
        sys.exit(1)

    # Initialize Anthropic client
    client = Anthropic(api_key=api_key)

    # Load recipes
    print(f"Loading recipes from {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        recipes = json.load(f)

    print(f"Found {len(recipes)} recipes to process")

    if dry_run:
        print("\n🔍 DRY RUN MODE - No changes will be saved\n")

    # Process each recipe
    enhanced_recipes = []
    for i, recipe in enumerate(recipes, 1):
        print(f"\n[{i}/{len(recipes)}] Processing: {recipe['name']}")

        if dry_run:
            print(f"  Original: {recipe['instructions'][:100]}...")

        # Enhance instructions
        enhanced_instructions = enhance_instructions(client, recipe)

        # Create new recipe with enhanced instructions
        enhanced_recipe = recipe.copy()
        enhanced_recipe['instructions'] = enhanced_instructions
        enhanced_recipes.append(enhanced_recipe)

        if dry_run:
            print(f"  Enhanced: {enhanced_instructions[:100]}...")
        else:
            print(f"  ✓ Enhanced")

    # Save results
    if not dry_run:
        print(f"\nSaving enhanced recipes to {output_file}...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(enhanced_recipes, f, ensure_ascii=False, indent=2)
        print("✓ Done!")
    else:
        print("\n✓ Dry run complete (no changes saved)")

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Enhance recipe instructions using AI')
    parser.add_argument('--input', default='recipes.json', help='Input JSON file')
    parser.add_argument('--output', help='Output JSON file (defaults to input file)')
    parser.add_argument('--dry-run', action='store_true', help='Test without saving changes')
    parser.add_argument('--dev', action='store_true', help='Process recipes-dev.json instead')

    args = parser.parse_args()

    # Handle dev mode
    if args.dev:
        args.input = 'recipes-dev.json'

    process_recipes(
        input_file=args.input,
        output_file=args.output,
        dry_run=args.dry_run
    )
