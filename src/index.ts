#!/usr/bin/env node

import { input, number } from '@inquirer/prompts';
import { Command } from 'commander';

interface RecipeDraft {
  name: string;
  servings: number;
  tags: string[];
}

const program = new Command();

program
  .name('recipes')
  .description('Create and manage recipes from the command line')
  .version('1.0.0');

program
  .command('add')
  .description('Create a recipe interactively')
  .action(async (): Promise<void> => {
    const name = await input({
      message: 'Recipe name:',
      validate: (value) => value.trim() ? true : 'A recipe name is required.',
    });

    const servings = await number({
      message: 'Servings:',
      default: 2,
      validate: (value) =>
        typeof value === 'number' && Number.isInteger(value) && value > 0
          ? true
          : 'Enter a whole number greater than zero.',
    });

    const tagsInput = await input({
      message: 'Tags (comma-separated, optional):',
    });

    if (servings === undefined) {
      throw new Error('Servings are required.');
    }

    const recipe: RecipeDraft = {
      name: name.trim(),
      servings,
      tags: tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    console.log('\nRecipe draft:');
    console.log(JSON.stringify(recipe, null, 2));
  });

await program.parseAsync();
