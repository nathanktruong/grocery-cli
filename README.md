ARCHIVED. The work to get grocery store prices would be a significant blocker -- relying on webpage elements would be brittle, and there's no readily available APIs.

# grocery-cli

A command-line recipe helper.

## Add a recipe

After installing the package globally or linking it locally, run:

```bash
recipes add
```

The command asks for a recipe name, servings, and optional comma-separated tags,
then prints the resulting recipe draft as JSON.

## Development

To compile and run the linked CLI locally:

```bash
npm run build
npm link
recipes add
```
