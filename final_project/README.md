# Final Practice Project

## Run the app

Remember to disable the warning:

```bash
support for loading es module in require() is an experimental feature and might change at any time.`
```

To disable it, just set `NODE_OPTIONS` like below. The tricks were discussed [here](https://github.com/npm/cli/issues/7857).

```bash
NODE_OPTIONS='--disable-warning=ExperimentalWarning' npm start
```
