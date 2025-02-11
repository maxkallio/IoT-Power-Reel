# Project Setup and Test Script Execution

## Steps to Run the Test Script

### 1. Start the Containers

In the root directory of your project, start the Docker containers using Docker Compose.

```bash
docker-compose -f docker-compose-test.yml up -d --force-recreate --build
```
This command will start all the services defined in the docker-compose.yml file in detached mode (-d), meaning the containers will run in the background.

### 2. Run the test script

```bash
sh test-infra.sh
```


## What the Script Does

The script performs several checks to ensure the following services are available:

- Nginx Server: The script checks if the Nginx container is accessible.
- phpMyAdmin: The script checks if phpMyAdmin works.
- API Endpoint: The script checks if the API is working.
- MariaDB: The script checks if the MariaDB container is working.

If all tests pass, the script will output:

```
Tests ran successfully
```