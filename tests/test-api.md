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
bash test-api.sh
```


## What the Script Does

The script does the following:

- Verify if the getAvailableLocker function is working.
- Verify if the getCables function is working.
- Verify if the getUser function is working.
- Verify if the getUser function is working with misformed user ID's
- Verify if the getUser function is working with nonexistent user ID's
- Verify if the getUser function is working with no user ID parameter

It will also stress test every function.

If all tests pass, the script will output:

```
echo "All API calls verified successfully."
```