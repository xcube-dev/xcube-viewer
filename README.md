# xcube-viewer

A simple viewer component for Xcube server.

![xcube-viewer](./doc/xcube-viewer.jpg)

## Run it

1. Install [xcube](https://github.com/dcs4cop/xcube) and run server in demo mode
2. Install and start `xcube-viewer` with demo configuration


### `xcube`

`xcube` one-time install:

    $ git clone https://github.com/dcs4cop/xcube.git
    $ cd xcube
    $ conda env create
    $ conda activate xcube
    $ python setup.py develop  

    
`xcube` update and run server:

    $ cd xcube
    $ git pull
    $ conda activate xcube  
    $ xcube serve --verbose --traceperf --config xcube/webapi/res/demo/config.yml  
    
If errors occur, you may need to update the environment:

    $ conda env update

### `xcube-viewer`

Checkout `xcube-viewer` sources:

    $ git clone https://github.com/dcs4cop/xcube-viewer.git
    $ cd xcube-viewer
    $ yarn install
    $ yarn start

Update, install, and run:

    $ cd xcube-viewer
    $ git pull
    $ yarn install
    $ yarn start


Build `xcube-viewer` for deployment with `default` branding:

    $ cd xcube-viewer
    $ git pull
    $ yarn build
    
Find outputs in `./build`. To build different branding targets, create a file `.env.local` and specify
the branding, e.g.

    REACT_APP_BRANDING=eodatabee
    
will build target `eodatabee`. Available targets are `default`, `cyanoalert`, `eodatabee`, `esdl`.

To add a new branding, choose a branding name and create directories with that name in `public` 
and in `src/resources`. It is easiest to copy the `default` branding and rename it. 
Then alter what need be branded, e.g. typically the logos.

You will also need to add a new entry in object named `brandings` in `src/config.ts` 
using your branding name as key. Also here, it is best to copy the `default` one and adapt it
to your needs.       

## Features

* Select dataset, update variable and places list, fly to bounding box
* Select place (Lakes / Stations) and fly to bounding box
* Select variable and show as layer on map
* Select time and update variable layer on map
* Click in map and show time series chart
* Select a place and show time series chart
* Select dataset and fly to bounding box
* Select place and fly to bounding box
* Click in time series chart and select time
* Show selected time in time series chart
* Zoom into and out of time series chart
* Use local time in UI (backend provides UTC time only)
* Show a variable's legend in map
* Switch language. Texts are internationalizable. Locales are currently "en" and "de". (see constant `I18N` in `src/config/config.ts`)
* Show modal "loading" dialog on initial data load
* Show toast on info events (e.g. server error) 
* Animate through time (play forw/back)
* Added means to select a time slice
* Time ranges set from datasets
* Change xcube server. Users' xcube server configurations are saved in local browser storage.  
* Place groups associated to datasets
  - produce a unique vector layer in the map;
  - can specify their feature property fields that will provide the values for predefined roles:
    "label", "infoUrl" (not used yet);

## More

* [User Guide](https://xcube.readthedocs.io/en/latest/viewer.html#)
* [Planned Enhancements](https://github.com/dcs4cop/xcube-viewer/labels/enhancement)
* [Known Issues](https://github.com/dcs4cop/xcube-viewer/labels/bug)


--- 



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) v3.3.0.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).




