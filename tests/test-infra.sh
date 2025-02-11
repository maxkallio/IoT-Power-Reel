#!/bin/bash

container_names=$(docker network inspect yoogaaciinuu24_default -f '{{range .Containers}}{{.Name}} {{end}}')

nginx_ip=""
mariadb_ip=""

for container in $container_names; do

    ip_address=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$container")

    case "$container" in
        "iot-power-team-nginx")
            nginx_ip=$ip_address
            echo $nginx_ip
            ;;
        "iot-power-team-mariadb")
            mariadb_ip=$ip_address
            echo $mariadb_ip
            ;;
        *)
            ;;
    esac
done

if [ -z "$nginx_ip" ]; then
    echo "Nginx container IP not found, tests cannot run"
    exit 1
fi

if [ -z "$mariadb_ip" ]; then
    echo "MariaDB container IP not found, tests cannot run"
    exit 1
fi

docker exec iot-power-team-testingcontainer /bin/bash -c "curl -sf --max-time 5 http://$nginx_ip" > /dev/null || {
    echo "Web server is not accessible at http://$nginx_ip"
    exit 1
}

docker exec iot-power-team-testingcontainer /bin/bash -c "curl -sf --max-time 5 http://$nginx_ip/phpmyadmin" > /dev/null || {
    echo "phpMyAdmin is not accessible at http://$nginx_ip/phpmyadmin"
    exit 1
}

docker exec iot-power-team-testingcontainer /bin/bash -c "curl -sf --max-time 5 http://$nginx_ip/api/get.php?getCables" > /dev/null || {
    echo "API is not working at http://$nginx_ip/api/get.php?getCables"
    exit 1
}

docker exec iot-power-team-testingcontainer /bin/bash -c "nc -z -w 5 $mariadb_ip 3306" > /dev/null || {
    echo "MariaDB is not accessible at $mariadb_ip on port 3306"
    exit 1
}

echo "Tests ran successfully"