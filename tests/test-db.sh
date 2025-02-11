#!/bin/bash

container_names=$(docker network inspect yoogaaciinuu24_default -f '{{range .Containers}}{{.Name}} {{end}}')

mariadb_ip=""

# Loop through container names to find MariaDB container IP
for container in $container_names; do

    ip_address=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$container")

    case "$container" in
        "iot-power-team-mariadb")
            mariadb_ip=$ip_address
            echo "MariaDB IP: $mariadb_ip"
            ;;
        *)
            ;;
    esac
done

if [ -z "$mariadb_ip" ]; then
    echo "MariaDB container IP not found, tests cannot run"
    exit 1
fi

docker exec iot-power-team-testingcontainer /bin/bash -c "nc -z -w 5 $mariadb_ip 3306" > /dev/null || {
    echo "MariaDB is not accessible at $mariadb_ip on port 3306"
    exit 1
}

db_check=$(docker exec iot-power-team-mariadb /bin/bash -c "mariadb -u root -proot123 -e 'SHOW DATABASES LIKE \"locker\";' | grep locker")
if [[ -z "$db_check" ]]; then
    echo "Database 'locker' does not exist"
    exit 1
fi

table_check_cable=$(docker exec iot-power-team-mariadb /bin/bash -c "mariadb -u root -proot123 -e 'SHOW TABLES FROM locker LIKE \"Cable\";' | grep Cable")
if [[ -z "$table_check_cable" ]]; then
    echo "Table 'Cable' does not exist in the 'locker' database"
    exit 1
fi

table_check_locker=$(docker exec iot-power-team-mariadb /bin/bash -c "mariadb -u root -proot123 -e 'SHOW TABLES FROM locker LIKE \"Locker\";' | grep Locker")
if [[ -z "$table_check_locker" ]]; then

    echo "Table 'Locker' does not exist in the 'locker' database"
    exit 1
fi

table_check_user=$(docker exec iot-power-team-mariadb /bin/bash -c "mariadb -u root -proot123 -e 'SHOW TABLES FROM locker LIKE \"User\";' | grep User")

if [[ -z "$table_check_user" ]]; then
    echo "Table 'User' does not exist in the 'locker' database"
    exit 1
fi

echo "Database and tables verified successfully"