import Database from 'better-sqlite3';

export interface Recipe extends RecipeDraft {
  id: number;
}

export interface RecipeDraft {
  name: string;
  servings: number;
  tags: string[];
}

// Initialize connection
export const db = new Database('recipes.db');

// Export an init function to create tables & configure pragmas
export function initDatabase(): void {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      servings INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );
  `);
}

/**
 * Adds the full recipe, with tags, to the database
 * @returns recipe rowid
 */
export function addRecipe(name: string, servings: number, tags: string[]): number {
  // syntax note: transaction() is used to group multiple write statements
  // (like INSERT) into a single unit, so that they succeed or fail together.
  const insert = db.transaction((name, servings, tags) => {
    // adds recipe
    const info = db.prepare('INSERT INTO recipes (name, servings) VALUES (?, ?)').run(name, servings);

    // get rowid of the recent recipe row inserted into the db
    const id = info.lastInsertRowid;

    // add tags in relation to the recipe id
    const insertTag = db.prepare('INSERT INTO tags (recipe_id, name) VALUES (?, ?)');
    for (const tag of tags) insertTag.run(id, tag);

    // return recipe rowid
    return Number(id);
  });

  // run full insert transaction
  return insert(name, servings, tags);
}

/**
 * Get all recipes in the db (does not join with tags yet)
 * @returns array of recipes
 */
export function getRecipes(): Recipe[] {
  // syntax note: `prepare` compiles a SQL query for exeution. The following SELECT query is automatically read-safe in SQLite.
  const rows = db.prepare(`
      SELECT
        r.id,
        r.name,
        r.servings,
        GROUP_CONCAT(t.name) as tags
      FROM recipes r
      LEFT JOIN tags t ON r.id = t.recipe_id
      GROUP BY r.id
    `).all() as { id: number; name: string; servings: number; tags: string | null }[];
    return rows.map((row) => ({
      ...row,
      tags: row.tags ? row.tags.split(',') : [],
    }));
}
