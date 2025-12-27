# Recipe Browser

A web-based recipe browser with AI-powered recipe enhancement capabilities.

## Project Structure

```
.
├── data/                          # All recipe data files
│   ├── recipes.json              # Production recipes (122 recipes)
│   └── recipes-dev.json          # Development/test recipes (3 recipes)
│
├── scripts/                       # Recipe processing scripts
│   ├── process_recipes.sh        # Main script to enhance recipes
│   ├── enhance_recipes.py        # Python script for AI enhancement
│   ├── enhancement_prompt.txt    # Configurable AI prompt template
│
├── server.py                      # Flask server
├── start_server.sh               # Start the Flask server
├── recipe-browser.html           # Main web application
├── requirements.txt              # Python dependencies
└── venv/                         # Python virtual environment
```

## Getting Started

### 1. Start the Server

```bash
# Production mode (uses data/recipes.json)
./start_server.sh

# Development mode (uses data/recipes-dev.json)
./start_server.sh --dev
```

The server will run at http://localhost:5555

### 2. Enhance Recipes (Optional)

Use AI to improve recipe instructions:

```bash
# Interactive mode
./scripts/process_recipes.sh

# Or directly with Python
python3 scripts/enhance_recipes.py --dev --limit 5
```

## Recipe Enhancement

The recipe enhancement system uses Claude AI to improve recipes in three ways:
1. **Fix Titles** - Ensures proper capitalization and grammar
2. **Fix Ingredients** - Makes all ingredients lowercase and grammatically correct
3. **Enhance Instructions** - Makes instructions clearer and more detailed

### Configuration

Edit `scripts/enhancement_prompt.txt` to customize how recipe instructions are enhanced. The prompt supports these placeholders:
- `{name}` - Recipe name
- `{ingredients}` - Formatted ingredient list
- `{instructions}` - Current instructions

### Basic Usage

```bash
# Enhance all aspects (titles, ingredients, instructions)
python3 scripts/enhance_recipes.py --dev --limit 5

# Enhance all production recipes
python3 scripts/enhance_recipes.py --input data/recipes.json

# Dry run (test without saving)
python3 scripts/enhance_recipes.py --dev --dry-run

# Custom prompt file
python3 scripts/enhance_recipes.py --dev --prompt custom_prompt.txt
```

### Selective Enhancement

You can choose what to enhance using these flags:

```bash
# Only fix titles
python3 scripts/enhance_recipes.py --dev --only-titles

# Only fix ingredients
python3 scripts/enhance_recipes.py --dev --only-ingredients

# Only enhance instructions
python3 scripts/enhance_recipes.py --dev --only-instructions

# Enhance everything except titles
python3 scripts/enhance_recipes.py --dev --skip-titles

# Enhance everything except ingredients
python3 scripts/enhance_recipes.py --dev --skip-ingredients

# Enhance everything except instructions
python3 scripts/enhance_recipes.py --dev --skip-instructions
```

### Examples

```bash
# Fix grammar on first 5 recipes (titles and ingredients only)
python3 scripts/enhance_recipes.py --dev --limit 5 --skip-instructions

# Only improve instructions for all recipes
python3 scripts/enhance_recipes.py --input data/recipes.json --only-instructions

# Test ingredient fixes without saving
python3 scripts/enhance_recipes.py --dev --only-ingredients --dry-run
```

## Recipe JSON Structure

```json
{
  "name": "Recipe Name",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": "Step by step instructions...",
  "rating": 5,
  "labels": ["glutenfree", "quick and easy"],
  "mealType": "lunch",
  "season": "autumn"
}
```

### Fields

- **name**: Recipe name (required)
- **ingredients**: Array of ingredient strings (required)
- **instructions**: Cooking instructions - supports HTML formatting (required)
- **rating**: 0-5 stars (optional, default: 0)
- **labels**: Regular labels like "glutenfree", "family friendly" (optional)
- **mealType**: One of: breakfast, lunch, snack, dessert (optional)
- **season**: One of: spring, summer, autumn, winter (optional)

### HTML Formatting in Instructions

The instructions field supports HTML for rich formatting. When editing recipes, a rich text editor (similar to MS Word) is provided for easy formatting without knowing HTML.

#### Rich Text Editor Features

When editing a recipe, you'll see a toolbar with these formatting options:
- **B** - Bold text (Ctrl/Cmd+B)
- **I** - Italic text (Ctrl/Cmd+I)
- **≡** - Numbered list
- **•** - Bulleted list
- **✕** - Clear formatting

The editor provides a WYSIWYG (What You See Is What You Get) experience, making it easy for non-technical users to format recipes beautifully.

#### HTML Structure (for reference)

```json
{
  "instructions": "<ol><li><strong>Prepare</strong> the ingredients by chopping vegetables.</li><li>Heat oil in a pan for <em>2-3 minutes</em>.</li><li>Add the vegetables and <strong>sauté</strong> until tender.</li></ol>"
}
```

Supported HTML tags:
- `<ol>`, `<ul>`, `<li>` - Lists
- `<p>` - Paragraphs
- `<strong>`, `<b>` - Bold/important text (orange color)
- `<em>`, `<i>` - Italic/emphasis text
- `<h1>`, `<h2>`, `<h3>`, `<h4>` - Headings
- `<hr>` - Horizontal line
- `<blockquote>` - Quoted text
- `<code>`, `<pre>` - Code formatting

## Development

### Requirements

- Python 3.x
- Flask
- flask-cors
- anthropic (for recipe enhancement)

### Install Dependencies

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### API Endpoints

- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Save all recipes
- `PUT /api/recipes/<index>` - Update a single recipe
