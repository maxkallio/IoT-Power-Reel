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
bash test-db.sh
```


## What the Script Does

The script does the following:

- Verify if the MariaDB container is working.
- Verify if the locker database exists
- Verify if the 'Cable' table exists
- Verify if the 'Locker' table exists
- Verify if the 'User' table exists

If all tests pass, the script will output:

```
echo "Database and tables verified successfully"
```