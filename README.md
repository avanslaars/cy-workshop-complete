# Test a React TodoMVC with Cypress


This repository is the end result of a Cypress workshop that tests a todo MVC.

## Setup

1. Clone this repository
2. Install dependencies with `npm i` from this project's root directory
3. Build and run the project with `npm run dev`
4. Run the Cypress UI with `npm run cypress` (app should be running in another terminal window)
5. Run headless Cypress with `npm run cypress:all` (app should be running in another terminal window)


## Project Overview

### Server

The app is hosted with an express server, based on `json-server`. This gives us static file hosting of the todo app, as well as the API the app uses for data. The data is stored in `db.json`. The `server.js` file also defines some custom endpoints to bulk delete and bulk load data for the full e2e tests in the `cypress/integeration/smoke-tests.spec.js` file. When running true e2e tests, you still want reliable data, so a separate data source with endpoints like these will make it easier and faster to setup for tests over repeated runs.

### The Client

The client app uses React and is built with webpack. Cypress isn't limited to React and can test anything that runs in a browser. This project uses React because that is my preference, but knowledge of React isn't required.

### The Tests

All Cypress tests are located in `cypress/integration`. Data used to stub the XHR calls and seed the DB for the e2e tests is defined in the `cypress/fixtures` directory.