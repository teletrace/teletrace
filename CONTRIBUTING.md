# Contributing Guide

Thank you for your interest in contributing! We welcome all people who want to contribute. This document is a guide to help you through the process of contributing.

## Ways to contribute

there are a few different ways you can contribute to the community:

- Contribute to the source code
- Find and report bugs
- Help other users by answering questions

### Reporting bugs

Before openning a bug report, please make sure that someone hasn't already reported the issue, and looks through the [existing issues](https://github.com/epsagon/oss-tracing/issues?q=is%3Aopen+is%3Aissue+label%3Abug) for simillar issues.

Report a bug by issueing a [bug report](https://github.com/epsagon/oss-tracing/issues/new?assignees=&labels=&template=bug_report.md&title=), when reporting a bug please try to:

- Describe the problematic behavior (expected vs actual) in as much details as possible
- Steps to reproduce the issue
- Any additional context you feel might help in fixing the issue

### Requesting a feature

Before requesting a feature, please make sure that the requested feature is not [already requested](https://github.com/epsagon/oss-tracing/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement), or is not already on our [roadmap](https://github.com/orgs/epsagon/projects/3).

Request a feature by issueing a [feature request](https://github.com/epsagon/oss-tracing/issues/new?assignees=&labels=&template=feature_request.md&title=), when requesting a feature try to:

- Outline the issues you are trying to solve
- Provide a detailed description of the solution you whould like to see implemented
- Some alternatives if applicable
- Any additional context that would help the maintainers prioritize the request

## Contribute code

### Before you start

Select a good issue from the links below:

- [Good First Issue](https://github.com/epsagon/oss-tracing/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)
- [Help Wanted](https://github.com/epsagon/oss-tracing/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)

Comment on the issue so that we can assign it to you and provide clarity if needed.

If you wish to work on an issue (feature / bug fix) that is not listed already please create an issue before starting to work on implementing it.

### Developing

This guide helps you get started developing.

#### Tools needed

Make sure you have the following tools installed:

- [Git](https://git-scm.com/)
- [Go](https://golang.org/dl/) 1.19 or above
- [Make](https://www.gnu.org/software/make/)
- [pre-commit](https://pre-commit.com/)

*make sure to install pre-commit hooks by running `pre-commit install` from the root of the project after cloning*

#### Project layout

This project is following the [standard go project layout](https://github.com/golang-standards/project-layout), please read though their docs to make sure you know where each file should go.

#### Commit Messages

Use descriptive commit messages. Here are [some recommendations](https://cbea.ms/git-commit/) on how to write good commit messages. When creating PRs GitHub will automatically copy commit messages into the PR description, so it is a useful habit to write good commit messages before the PR is created. Also, unless you actually want to tell a story with multiple commits make sure to squash into a single commit before creating the PR.

When maintainers merge PRs with multiple commits, they will be squashed and GitHub will concatenate all commit messages right before you hit the "Confirm squash and merge" button. Maintainers must make sure to edit this concatenated message to make it right before merging. In some cases, if the commit messages are lacking the easiest approach to have at least something useful is copy/pasting the PR description into the commit message box before merging (but see above paragraph about writing good commit messages in the first place).
