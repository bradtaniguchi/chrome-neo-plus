# common-react

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test common-react` to execute the unit tests via [Jest](https://jestjs.io).

## Running storybook

Run `nx run common-react:storybook` to execute the local storybook project.

### Tailwind component migration

The migration to tailwind, and away from MUI will take some time. The following
is a checklist of components to re-create to support the internal-client page:

- [x] Card
- [ ] Button (for linking)
- [ ] Spinner/Loading
- [ ] Grid/Layout
- [ ] Icon
- [ ] List
- [ ] Header/AppBar
- [ ] Chip

Some of these components could be provided in the internal-client if they can't
be re-used. Otherwise these should be here and defined as a React component
so they can be used later in whatever project this template is used for

Other things we should look into are all related to inputs, like dropdowns
and menus. These seem to be more advanced though.

#### Adding tailwind to an existing project

Run the following to add tailwind support to a given project:

```bash
npx nx g @nrwl/react:setup-tailwind --project=<your app here>
```
