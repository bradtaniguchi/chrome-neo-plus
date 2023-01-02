// import { addDecorator, addParameters } from '@storybook/react';
// import { themes } from '@storybook/theming';
// import { DocsContainer } from '@storybook/addon-docs';

// export const parameters = {
//   darkMode: {
//     dark: themes.dark,
//     light: themes.light,
//   },
//   docs: { theme: themes.light },
//   actions: { argTypesRegex: '^on.*' },
// };

// const muiTheme = createTheme({
//   palette: {
//     primary: blue,
//   },
// });

// addDecorator((story) => (
//   <ThemeProvider theme={muiTheme}>{story()}</ThemeProvider>
// ));

// addParameters({
//   docs: {
//     container: ({ children, context }) => (
//       <DocsContainer context={context}>
//         <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
//       </DocsContainer>
//     ),
//   },
// });
