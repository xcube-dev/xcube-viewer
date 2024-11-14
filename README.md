# xcube Viewer

A simple viewer component for [xcube](https://xcube.readthedocs.io/).

![xcube-viewer](./docs/assets/images/xcube-viewer.png)

## Run it

Note, there is no need to install xcube Viewer on its own.
It is bundled with the [xcube](https://github.com/xcube-dev/xcube)
Python package since version 1.0. Just run
```bash
xcube serve -c server-config.yaml
```
and access the viewer via the server endpoint `/viewer`,
hence http://127.0.0.1/viewer, when run without URL prefix.

For development or for independent deployment, please read ahead to

1. install [xcube](https://github.com/xcube-dev/xcube) and run server in demo mode;
2. install and start `xcube-viewer` with demo configuration.

### Install `xcube` in development mode

`xcube` one-time install:

    $ git clone https://github.com/xcube-dev/xcube.git
    $ cd xcube
    $ conda env create
    $ conda activate xcube
    $ pip install -ve .  

`xcube` update and run server:

    $ cd xcube
    $ git pull
    $ conda activate xcube  
    $ xcube serve --verbose --traceperf --config xcube/examples/serve/demo/config.yml  

If errors occur, you may need to update the environment:

    $ conda env update

### Install and run `xcube-viewer` in development mode

Checkout `xcube-viewer` sources:

    $ git clone https://github.com/xcube-dev/xcube-viewer.git
    $ cd xcube-viewer
    $ npm install
    $ npm run dev

Update, install, and run:

    $ cd xcube-viewer
    $ git pull
    $ npm install
    $ npm run dev

Build `xcube-viewer` for deployment with `default` branding:

    $ cd xcube-viewer
    $ git pull
    $ npm run build

Find outputs in `./dist`.

### Update `xcube` by a new `xcube-viewer` build

To bundle the `xcube` package with a new `xcube-viewer` version first build 
`xcube-viewer` as described above.
Then, in the xcube repo checked out from GitHub replace the contents the 
`xcube/webapi/viewer/data` directory with the contents of the `./dist` 
directory. Note, it is important to replace the contents, 
do not just copy. 
Finally, add new files to git and commit all changes.  


## Developer Guide

### Code organisation

Given here are the top-level modules in the source code folder `src`:

| Module        | Content                                                              |
|---------------|----------------------------------------------------------------------|
| `actions/`    | Actions associated with different application states                 |
| `api/`        | Server endpoint access functions                                     |
| `components/` | Plain React components                                               |
| `connected/`  | Higher-level Rect components connected to Redux                      |
| `hooks/`      | React hook functions                                                 |
| `model/`      | Data model types and model-specific functions                        |
| `reducers/`   | Redux reducer functions associated with different application states |
| `resources/`  | Application JSON and image resources                                 |
| `selectors/`  | Selectors associated with with different application states          |
| `states/`     | All the application states                                           |
| `util/`       | Basic utility types and functions                                    |
| `volume/`     | Experimental volume rendering code                                   |
| `config`      | Application configuration access                                     |
| `index`       | Application entry point                                              |
| `version`     | Application version string                                           |


### Styling

Use the `sx` property of MUI components. Avoid inline style objects. Instead,
create a local module object `styles` 

```typescript
import { makeStyles } from "@/util/styles";

const styles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  ...
}
```

and use its properties in components

```typescript
<Box sx={styles.container}>...</Box>
```

## More

* [User Guide](https://xcube-dev.github.io/xcube-viewer/)
* [Planned Enhancements](https://github.com/xcube-dev/xcube-viewer/labels/enhancement)
* [Known Issues](https://github.com/xcube-dev/xcube-viewer/labels/bug)

--- 

This project was bootstrapped with React + TypeScript + Vite.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list


## Documentation

The `xcube-viewer` documentation is built using the [mkdocs](https://www.mkdocs.org/) tool.

Create a Python enviromnent and install the following packages:
- ``mkdocs``
- ``mkdocs-material``
- ``mkdocs-autorefs``

With repository root as current working directory:

```bash
# Test local
mkdocs serve

# Publish
mkdocs gh-deploy
```