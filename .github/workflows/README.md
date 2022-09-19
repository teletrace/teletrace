# GitHub Actions Workflows

We use Github Actions for automation and continuous integration

## CI

the CI process ensures the coding standards are kept and remain consistent throughout the project, steps are:

- validate the PR title, to align with semantic conventions
- run all pre-commit hooks defined in [.pre-commit-config.yaml](../../.pre-commit-config.yaml)
  - check yaml files
  - check newlines at the end of files
  - trim trailing whitespace
  - run go-fmt and go-imports
  - run prettier
  - run eslint
- run unit tests
