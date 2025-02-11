## Introduction

`IoT - Power` is a system for lending power reels in the HBO-ICT faculty on campus.

Students can use this system with their student cards to authenticate to the server, so that they can retrieve a power reel.

## Development

This project consists of two major components, found in their respective directories.

- Embedded
- Web

These two components work together to form the system as a whole.

### Embedded

The embedded directory contains all code for the microcontroller. IoT - Power uses <a href="https://platformio.org/">PlatformIO</a>, a framework for embedded systems for embedded code.

### Web

The web component consits of a database (SQL, MariaDB) and a LEMP stack.

### Running IoT - Power

Both components have to be deployed for this project to work.

#### Web
```shell
docker-compose -f docker-compose-test.yml up -d --force-recreate --build
```

#### Embedded

For the embedded system you first need to change the config to point to the deployed webserver. Then use PlatformIO to compile and upload the code to your microcontroller.
There's two different deployment modes. For each deployment mode different firmware is built. With platformIO you can choose between:
- Offline mode
- Online mode

Refer to the platformio.ini to find the differences between the two. There's some additional configuration needed for each mode however.

##### Online mode

In the platformio.ini you need to change the `BASE_URL` param to the IP address of the backend server.

e.g. `\"http://145.92.189.162/api/\"`. Please note the escape backticks in this `BASE_URL` param, this is mandatory!

##### Offline mode

In `/embedded/src/locker-offline.cpp` the inititlization of a struct `locker` named `lockers` can be found. This struct is a mapping of locking pins to the lockers along it's current state. In it's header file you can find it's definition.

You need to change `lockers` to the amount of lockers used in the deployment, with a correct mapping of locking pins to the locker.# IoT-Power-Reel
# IoT-Power-Reel
# IoT-Power-Reel
