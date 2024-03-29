# Contributing Guide

Thank you for your interest in contributing! We welcome all people who want to contribute. This document is a guide to help you through the process of contributing.

## Ways to contribute

there are a few different ways you can contribute to the community:

- Contribute to the source code
- Find and report bugs
- Help other users by answering questions
- Participate in product [discussions](https://github.com/teletrace/teletrace/discussions)

### Reporting bugs

Before opening a bug report, please make sure that no one has already reported the issue, and look through the [existing issues](https://github.com/teletrace/teletrace/issues?q=is:open+is:issue+label:bug) for similar issues.

Report a bug by issuing a [bug report](https://github.com/teletrace/teletrace/issues/new?assignees=&labels=&template=bug_report.md&title=), when reporting a bug please try to:

- Describe the problematic behavior (expected vs actual) in as much detail as possible
- Steps to reproduce the issue
- Any additional context you feel might help in fixing the issue

### Requesting a feature

Before requesting a feature, please make sure that the feature is not [already requested](https://github.com/teletrace/teletrace/issues?q=is:open+is:issue+label:enhancement).

Request a feature by issuing a [feature request](https://github.com/teletrace/teletrace/issues/new?assignees=&labels=&template=feature_request.md&title=), when requesting a feature try to:

- Outline the issues you are trying to solve
- Provide a detailed description of the solution you would like to see implemented
- Some alternatives if applicable
- Any additional context that would help the maintainers prioritize the request

## Contribute code

### Before you start

Select a good issue from the links below:

- [Good First Issue](https://github.com/teletrace/teletrace/issues?q=is:open+is:issue+label:%22good+first+issue%22)
- [Help Wanted](https://github.com/teletrace/teletrace/issues?q=is:open+is:issue+label:%22help+wanted%22)

Comment on the issue so that we can assign it to you and provide clarity if needed.

If you wish to work on an issue (feature/ bug fix) that is not listed already please create an issue before starting to work on implementing it.

### Developing

This guide helps you get started developing.

#### Tools Needed

Make sure you have the following tools installed:

- [Git](https://git-scm.com/)
- [Go](https://golang.org/dl/) 1.19 or above
- [Node](https://nodejs.org/) 12.17 or above
- [Make](https://www.gnu.org/software/make/)
- [yarn](https://yarnpkg.com/)
- [pre-commit(Optional)](https://pre-commit.com/)
- [Docker](https://www.docker.com/)

##### Pre-Commit(Optional)

_make sure to install pre-commit hooks by running `pre-commit install` from the root of the project after cloning_

Pre-commit hooks are used to validate code before its being pushed to the remote, the configuration is located at [`.pre-commit-config.yaml`](./.pre-commit-config.yaml) file,
all pre-commit rules are validated on the CI as well so if you don't want to run them locally for some reason feel free to skip the local setup.

Pre commit installation can be done via: `pip`, `brew` or `conda`

To setup pre-commit hooks use the command: `pre-commit install`.

To execute pre-commit hooks regardless of a commit, for example to fix CI errors, you can use the `pre-commit run --all-files` to execute all rules on all files.

##### Makefile

[Makefile](./Makefile) is used to handle standard project lifecycle tasks such as `lint` and `test`,
to get a full list of the tasks available you can run `make list`, but as a general overview:

- `make lint` will run project linters (`golangci-lint` for the backend and `eslint` for the frontend)
- `make test` will run all tests for the project (using `go test` and `jest`)
- `make all-in-one` will build the docker image for the `all-in-one` package
- `make update-license-headers` will update all relevant source files to include license headers

#### Project Layout

This project is following the [standard go project layout](https://github.com/golang-standards/project-layout) in the backend and [bulletproof react](https://github.com/alan2207/bulletproof-react/) in the frontend, please read through their docs to make sure you know where each file should go.

### Coding Standards

#### Testing

We try to ensure that most functionality of Teletrace is well tested.

- At the package level, we write unit tests to test the functionality of the code in isolation.
  Those can be found within each package/module as `*_test.go` files.
- Next, a good practice is to use common tools like `docker-compose`, & `docker`
  to set up a local deployment and test the newly added functionality.

Make sure to run

```
make test
```

before submitting your PR to catch any failed tests.

### Commit Messages

Use descriptive commit messages. Here are [some recommendations](https://cbea.ms/git-commit/) on how to write good commit messages. When creating PRs GitHub will automatically copy commit messages into the PR description, so it's recommended to write good commit messages before the PR is created. Also, unless you intend to tell a story with multiple commits make sure to squash into a single commit before creating the PR.

When maintainers merge PRs with multiple commits, they will be squashed and GitHub will concatenate all commit messages right before you hit the "Confirm squash and merge" button. Maintainers must make sure to edit this concatenated message to make it right before merging. In some cases, if the commit messages are insufficient, the easiest approach is to copy and paste the PR description into the commit message box before merging (but see the above paragraph regarding using good commit messages in the first place).

Each commit message header must conform to the Commit Message Header format.

##### Commit Message Header

    <type>: <short summary>

##### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis CI, GitHub Actions, CircleCI)
- **docs**: Documentation only changes
- **feat**: New feature
- **fix**: Bug fix
- **perf**: Code changes to improve performance
- **refactor**: Code changes that neither fix a bug nor add a feature
- **test**: Adding missing tests or correcting existing tests

##### Short Summary

Use the summary field to provide a succinct description of the changes:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no period (.) at the end
