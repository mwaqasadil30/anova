# Anova.Evolve.Admin.Frontend

## Prerequisites

- Install [Docker](https://www.docker.com/community-edition#/download)
- If using `nvm/node` to run the app:
  - Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
  - Install [yarn v1](https://classic.yarnpkg.com/en/docs/install/)
- Otherwise, if using `Docker` to run the app:
  - Install [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

To begin working with this project locally in dev mode go through either the `nvm/node` or `Docker` steps:

### Using nvm/node?

```bash
# Start running these commands in this repo's directory
cp .sample.env ./frontend/.env
nvm use  # You may need to install the appropriate version of Node
cd frontend
yarn install
yarn start
```

### Using docker?

```bash
# Start running these commands in this repo's directory
cp .sample.env .env  # Copy a sample environment configuration
./ez build           # This is only required for the first time. Otherwise, run startall
./ez startall -l
```

## Generating TypeScript API code

See the [generate-api README](./generate-api/README.md) for instructions on how to generate TypeScript client code from the API's `swagger.json` file

## ez Shell Script

The ez shell script makes the `docker-compose` commands shorter and easier to use for the services available

Run `./ez -h` to see a list of commands that can be executed

## What services run

```
http://localhost:3000 - React application
```

## Cypress Test Automation Setup (Windows)

1. Download and install git
   https://git-scm.com/download/win

2. Download and install vscode

3. Download and install node
   https://nodejs.org/en/download/

4. Download and install yarn via the .msi file installer.
   https://classic.yarnpkg.com/en/docs/install/#windows-stable

5. Open vscode and go to the terminal. Click on the drop-down in the terminal and then click on select default shell. Select Git Bash.

6. Click on the plus icon to open another terminal.

7. Navigate to Anova.Evolve.Admin.Frontend\frontend and run yarn install.

## Cypress Test Automation Setup (Linux)

1. Download and install node

2. Navigate to frontend directory and run command:
   yarn install

## Cypress Test Automation Execution

### Execution in Test Runner

Navigate to frontend directory and execute the below command
bash init.sh USERNAME PASSWORD -r
or
bash init.sh USERNAME PASSWORD -runner

### Execution in headless

Navigate to frontend directory and execute the below command
bash init.sh USERNAME PASSWORD -hc
or
bash init.sh USERNAME PASSWORD -headless_chrome

## Release Code

| Branch           | Template          | Example           |
| ---------------- | ----------------- | ----------------- |
| Release branches | `[release/J-###]` | `[release/J-100]` |
| Release tags     | `J-###`           | `J-100`           |
