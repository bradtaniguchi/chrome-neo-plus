# storybook

This library will be used to run/develop storybook. It will provide
basic examples on how to write stories, and main setup code.

Other libs will be leveraged with storybook via [composition](https://nx.dev/storybook/storybook-composition-setup).

## Running unit tests

Run `nx test storybook` to execute the unit tests via [Jest](https://jestjs.io).

## Running storybook

Run `nx run storybook:storybook` to execute the local storybook project.

### Running all storybooks locally

This library is primarily used as the main storybook project, which uses storybook composition to
host/serve all storybooks within the project. These are built and combined within github-actions
and deployed to github pages.

To replicate this behavior locally run the follow commands:

```bash
npx nx run-many --target=build-storybook --all
mv dist/storybook/storybook/** dist/storybook/
npx http-server dist/storybook
```

### Generating a storybook stories for a library/app

run the following:

```bash
nx g @nrwl/storybook:configuration <project-name>
```

### Generating stories for a library/app

To generate all stories for all components within a given library or app, run the following:

```bash
nx g @nrwl/react:stories <project-name>
```

### Adding tailwind support

To add tailwind support to a storybook, perform the following:

- within the `.storybook` directory of the library create a `preview.js` file
  with the following contents:

```javascript
import './tailwind-imports.css';
```

- Within the same folder, create a `tailwind-imports.css` file with
  the following contents:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- Within the root folder of the library, create a `postcss.config.js` file with
  the following contents. This file is only used for storybook development

```javascript
const { join } = require('path');

/**
 * @type {import('postcss').AcceptedPlugin}
 */
module.exports = {
  plugins: {
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.js'),
    },
    autoprefixer: {},
  },
};
```

- Within the root folder of the library, create a `tailwind.config.js` file
  with the following contents. This file is only used for storybook development.

```javascript
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin'), require('@tailwindcss/typography')],
};
```

**note** the `require('flowbite/plug')` line. This is required to add the
flowbite plugin to the tailwind config.

### Adding a new sub-storybook

Storybooks will be generated, but wont be automatically linked without updating
the `./storybook/main.js` file within **this** project.

For example:

```javascript
module.export = {
  //...
  refs: {
    // other refs...
    'my-new-lib': {
      title: 'my-new-lib',
      url: 'my-new-lib/',
    },
  },
};
```

This will make it appear within the gh-page automatically. Otherwise to run individual storybooks,
see the project's docs.
