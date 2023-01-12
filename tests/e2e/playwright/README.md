# End-to-End Testing with Playwright

This project contains end-to-end tests for our application, which are designed to test the application as a whole, simulating the behavior of a real user.
These tests use Playwright as the automation testing tool.

## Running the Tests

All tests run automatically on every Pull Request by GitHub Actions, before merging into the main branch.

If you want to run the tests locally, make sure you have an instance of the application running.

1. Navigate to the `playwright` folder and install the dependencies by running

```bash
npm install
```

Or

```bash
yarn install
```

2. Running all tests

```bash
npx playwright test
```

Or

```bash
yarn playwright test
```

3. Running a single test file

```bash
npx playwright test <test-file-name.ts>
```

Or

```bash
yarn playwright test <test-file-name.ts>
```

Alternatively you can also run the tests using the [VS Code Extension](https://playwright.dev/docs/getting-started-vscode).

## Adding tests

All tests should be placed in the `tests` folder and should be divided to different folders according to the component it tests.

## Additional information

For more information on how to write and run tests with Playwright, please refer to the [Playwright documentation](https://www.npmjs.com/).
