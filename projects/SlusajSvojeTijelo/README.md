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

The recipe enhancement system uses Claude AI to make instructions clearer and more detailed.

### Configuration

Edit `scripts/enhancement_prompt.txt` to customize how recipes are enhanced. The prompt supports these placeholders:
- `{name}` - Recipe name
- `{ingredients}` - Formatted ingredient list
- `{instructions}` - Current instructions

### Options

```bash
# Enhance first 5 recipes from dev file
python3 scripts/enhance_recipes.py --dev --limit 5

# Enhance all production recipes
python3 scripts/enhance_recipes.py --input data/recipes.json

# Dry run (test without saving)
python3 scripts/enhance_recipes.py --dev --dry-run

# Custom prompt file
python3 scripts/enhance_recipes.py --dev --prompt custom_prompt.txt
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
- **instructions**: Cooking instructions (required)
- **rating**: 0-5 stars (optional, default: 0)
- **labels**: Regular labels like "glutenfree", "family friendly" (optional)
- **mealType**: One of: breakfast, lunch, snack, dessert (optional)
- **season**: One of: spring, summer, autumn, winter (optional)

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
