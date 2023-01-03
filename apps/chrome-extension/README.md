# chrome-extension

This project is the "main" project used to manage the actual building/deployment/testing
of the chrome-extension version of the chrome-neo-plus project.

Most of the actual application code will be defined within libraries and only loaded
here to combine them into a single deployable application.

## Building the project

Building the project uses a custom build.js script. Which can be ran with:

```bash
nx run chrome-extension:build
```

## Serving the project

Serving the project locally as an unpacked chrome-extension can be done with the following command:

```bash
nx run chrome-extension:serve
```

For more details on chrome-extension development see:
https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked
