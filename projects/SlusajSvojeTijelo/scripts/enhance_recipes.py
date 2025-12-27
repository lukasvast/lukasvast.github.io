#!/usr/bin/env python3
"""
Enhance recipes by improving instructions for clarity.
This script processes each recipe and uses AI to make instructions more clear and actionable.
"""

import json
import os
import sys
from pathlib import Path
from anthropic import Anthropic

def load_prompt(prompt_file='scripts/enhancement_prompt.txt'):
    """Load the enhancement prompt from a file."""
    # If it's a relative path, resolve from current directory
    prompt_path = Path(prompt_file)

    if not prompt_path.exists():
        print(f"Error: Prompt file not found: {prompt_path}")
        sys.exit(1)

    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()

def fix_ingredients(client, ingredients):
    """Use AI to fix ingredient grammar and ensure lowercase."""

    ingredients_text = "\n".join(f"{i+1}. {ing}" for i, ing in enumerate(ingredients))

    prompt = f"""You are a Croatian language expert. Fix the grammar and capitalization of these recipe ingredients.

Current ingredients:
{ingredients_text}

Requirements:
1. All ingredients should be lowercase (except proper nouns if absolutely necessary)
2. Fix any grammatical errors in Croatian
3. Keep the same meaning and quantities
4. Return ONLY the corrected ingredients list, one per line, without numbers
5. Keep the same order

Return format: one ingredient per line, no numbering, no explanations."""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=1000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Parse the response
        corrected = message.content[0].text.strip()
        fixed_ingredients = [line.strip() for line in corrected.split('\n') if line.strip()]

        return fixed_ingredients

    except Exception as e:
        print(f"  ⚠️  Error fixing ingredients: {e}")
        return ingredients  # Return original on error


def fix_title(client, title):
    """Use AI to fix recipe title grammar and capitalization."""

    prompt = f"""You are a Croatian language expert. Fix the grammar and capitalization of this recipe title.

Current title: {title}

Requirements:
1. First letter should be capitalized, rest lowercase (except proper nouns if needed)
2. Fix any grammatical errors in Croatian
3. Keep it concise and clear
4. Return ONLY the corrected title, nothing else

Return the corrected title only, no explanations."""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=200,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        corrected = message.content[0].text.strip()
        return corrected

    except Exception as e:
        print(f"  ⚠️  Error fixing title: {e}")
        return title  # Return original on error


def enhance_instructions(client, recipe, prompt_template):
    """Use AI to enhance recipe instructions."""

    # Format ingredients as a numbered list
    ingredients_text = "\n".join(f"{i+1}. {ing}" for i, ing in enumerate(recipe['ingredients']))

    # Create the prompt
    prompt = prompt_template.format(
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

def process_recipes(input_file='recipes.json', output_file=None, dry_run=False, limit=None, prompt_file='enhancement_prompt.txt',
                    fix_titles=True, fix_ingredients_flag=True, enhance_instructions_flag=True):
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

    # Load the enhancement prompt
    print(f"Loading prompt from {prompt_file}...")
    prompt_template = load_prompt(prompt_file)

    # Initialize Anthropic client
    client = Anthropic(api_key=api_key)

    # Load recipes
    print(f"Loading recipes from {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        recipes = json.load(f)

    # Apply limit if specified
    if limit and limit > 0:
        recipes = recipes[:limit]
        print(f"Limiting to first {limit} recipes (out of {len(recipes)} total)")

    print(f"Found {len(recipes)} recipes to process")

    if dry_run:
        print("\n🔍 DRY RUN MODE - No changes will be saved\n")

    # Process each recipe
    enhanced_recipes = []
    for i, recipe in enumerate(recipes, 1):
        print(f"\n[{i}/{len(recipes)}] Processing: {recipe['name']}")

        if dry_run:
            print(f"  Original title: {recipe['name']}")
            print(f"  Original ingredients: {recipe['ingredients'][:2]}...")
            print(f"  Original instructions: {recipe['instructions'][:100]}...")

        # Create enhanced recipe starting with original
        enhanced_recipe = recipe.copy()

        # Fix title
        if fix_titles:
            print(f"  → Fixing title...")
            enhanced_title = fix_title(client, recipe['name'])
            enhanced_recipe['name'] = enhanced_title
        else:
            enhanced_title = recipe['name']

        # Fix ingredients
        if fix_ingredients_flag:
            print(f"  → Fixing ingredients...")
            enhanced_ingredients = fix_ingredients(client, recipe['ingredients'])
            enhanced_recipe['ingredients'] = enhanced_ingredients
        else:
            enhanced_ingredients = recipe['ingredients']

        # Enhance instructions
        if enhance_instructions_flag:
            print(f"  → Enhancing instructions...")
            enhanced_instructions_text = enhance_instructions(client, recipe, prompt_template)
            enhanced_recipe['instructions'] = enhanced_instructions_text
        else:
            enhanced_instructions_text = recipe['instructions']

        enhanced_recipes.append(enhanced_recipe)

        if dry_run:
            if fix_titles:
                print(f"  Enhanced title: {enhanced_title}")
            if fix_ingredients_flag:
                print(f"  Enhanced ingredients: {enhanced_ingredients[:2]}...")
            if enhance_instructions_flag:
                print(f"  Enhanced instructions: {enhanced_instructions_text[:100]}...")
        else:
            if fix_titles:
                print(f"  ✓ Title: {enhanced_title}")
            if fix_ingredients_flag:
                print(f"  ✓ Ingredients: {len(enhanced_ingredients)} items")
            if enhance_instructions_flag:
                print(f"  ✓ Instructions enhanced")

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
    parser.add_argument('--input', default='data/recipes.json', help='Input JSON file')
    parser.add_argument('--output', help='Output JSON file (defaults to input file with -enhanced suffix)')
    parser.add_argument('--dry-run', action='store_true', help='Test without saving changes')
    parser.add_argument('--dev', action='store_true', help='Process recipes-dev.json instead')
    parser.add_argument('--limit', type=int, help='Limit number of recipes to process (e.g., --limit 5)')
    parser.add_argument('--prompt', default='scripts/enhancement_prompt.txt', help='Prompt template file')

    # Enhancement control flags
    parser.add_argument('--skip-titles', action='store_true', help='Skip fixing recipe titles')
    parser.add_argument('--skip-ingredients', action='store_true', help='Skip fixing ingredients')
    parser.add_argument('--skip-instructions', action='store_true', help='Skip enhancing instructions')
    parser.add_argument('--only-titles', action='store_true', help='Only fix titles')
    parser.add_argument('--only-ingredients', action='store_true', help='Only fix ingredients')
    parser.add_argument('--only-instructions', action='store_true', help='Only enhance instructions')

    args = parser.parse_args()

    # Handle dev mode
    if args.dev:
        args.input = 'data/recipes-dev.json'

    # Determine what to enhance
    fix_titles = True
    fix_ingredients_flag = True
    enhance_instructions_flag = True

    # Handle "only" flags
    if args.only_titles:
        fix_titles = True
        fix_ingredients_flag = False
        enhance_instructions_flag = False
    elif args.only_ingredients:
        fix_titles = False
        fix_ingredients_flag = True
        enhance_instructions_flag = False
    elif args.only_instructions:
        fix_titles = False
        fix_ingredients_flag = False
        enhance_instructions_flag = True
    else:
        # Handle "skip" flags
        if args.skip_titles:
            fix_titles = False
        if args.skip_ingredients:
            fix_ingredients_flag = False
        if args.skip_instructions:
            enhance_instructions_flag = False

    process_recipes(
        input_file=args.input,
        output_file=args.output,
        dry_run=args.dry_run,
        limit=args.limit,
        prompt_file=args.prompt,
        fix_titles=fix_titles,
        fix_ingredients_flag=fix_ingredients_flag,
        enhance_instructions_flag=enhance_instructions_flag
    )
