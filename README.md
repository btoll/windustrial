## Prerequisites

[Node.js], which also installs [npm].

## Installation

    npm install

> If you get any warnings about vulnerabilites, you can choose to fix them or not.  Either way the app will run.

## Starting

    npm start
    or
    make serve

Note that this backgrounds the Node process.  All logging to `stdout` is from [webpack].

## Windows

If you have trouble starting the application on Windows, you'll need to run the commands manually from the root of the project directory:

    node ./server/app.js &
	./node_modules/.bin/webpack-dev-server --open

## Misc

The UI is bootstrapped using webpack on port 3000.  To view, simply:

    http://localhost:3000

The [Express] web framework is handling the network requests and runs on port 3001.

[Node.js]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[webpack]: https://webpack.js.org/
[Express]: https://expressjs.com/

