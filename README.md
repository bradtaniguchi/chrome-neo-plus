# chrome-neo-plus

Overhaul of the [chrome-neo chrome extension](https://chrome.google.com/webstore/detail/chrome-neo/hggldlbbkkpnclkimhegjccgeaibeceg)

Leverages the following NASA apis:

- Astronomy Picture of the Day
- Asteroids NeoWs
- NASA Image and Video Library

All projects will use the following APIs:
<https://api.nasa.gov/>

## Previous Codebases

- [Original extension](https://github.com/bradtaniguchi/chrome-neo)
- [Partial re-write, used as a starting point](https://github.com/bradtaniguchi/chrome-neo2)
- [secondary Partial re-write, tried to use firebase](https://github.com/bradtaniguchi/chrome-neo-plus-legacy)

## Development

Provide an API_KEY in `.env` with format:

```bash
API_KEY=123
```

Then build a config file with, this only needs to be done initially.

```bash
npm run build:api-Config
```

Finally run the app in "chrome-extension mode" with:

```bash
npx nx run chrome-extension:serve
```

The build should be done and auto-updates, from here load the extension in the browser.

### Alternate serve mode

Use the following to serve the extension like any webapp

```bash
npm run serve:dist
```

Then go to `http://localhost:8080/popup.html` to view the app.

## License

[MIT](./LICENSE.md)
