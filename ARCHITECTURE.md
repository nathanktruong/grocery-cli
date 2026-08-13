TypeScript itself is not executed directly by Node in the normal npm-package workflow.

You write `src/index.ts`, then TypeScript compiles it into JavaScript at `dist/index.js`; Node runs that compiled file.

That’s why we added:

* `tsconfig.json`: tells TypeScript how and where to compile.
* `npm run build`: runs the TypeScript compiler (`tsc`).
* `dist/`: the generated JavaScript output.
* `"bin": { "recipes": "./dist/index.js" }`: points the CLI executable at runnable JavaScript, not `.ts`.
* `prepare`: builds automatically when the package is linked or packed/published.
