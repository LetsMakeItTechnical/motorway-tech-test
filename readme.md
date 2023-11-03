# Docker Operations for Motorway Test Backend

This repository contains a set of NPM scripts that simplify common Docker operations for managing the lifecycle of the `motorway-test-backend` Docker container. The container is based on the official PostgreSQL image and includes custom initialization scripts and a database dump.

## Prerequisites

Before you can use these scripts, you need to have the following installed:

- Docker: Ensure that Docker is installed and running on your machine. [Get Docker](https://www.docker.com/get-started)
- Node.js and npm: Make sure you have Node.js and npm installed to use the NPM scripts. [Download Node.js](https://nodejs.org/en/download/)

## Setup

Clone the repository to your local machine and navigate to the cloned directory. Make sure the Dockerfile and scripts are placed at the root of the directory.

## Available Scripts

The `package.json` file includes the following scripts for Docker container management:

### Build Image

Builds the Docker image with the necessary configurations.

```sh
npm run build-image

Start Container
Runs the Docker container from the built image in detached mode.

npm run start-db
View Logs
Displays the logs from the running Docker container.

npm run view-logs
To continuously follow the logs, use:

npm run view-logs -f
Stop and Remove Container
Stops the running Docker container and removes it. Use this to clean up.

npm run stop-db
For a forceful stop and remove (if the container doesnt stop gracefully):

npm run force-remove-db
Usage
To use any of the scripts, run the following command in your terminal:

npm run <script-name>
Replace <script-name> with the name of the script you wish to execute.

Contributing
If you wish to contribute to this repository or modify the Docker configurations, please ensure you update the scripts accordingly in package.json.

License
This project is licensed under the MIT License - see the LICENSE file for details.

vbnet

When writing a README.md, make sure to provide clear instructions on what the project is about, how to set it up, and how to use the provided scripts. Also, ensure that you include information about any prerequisites needed to use the project and provide a guide for contribution if it's open for collaboration.