# PlatformIO

PlatformIO is a versatile development environment for embedded systems that supports a big range of boards and frameworks, including Arduino, ESP-IDF, and STM32.
Unlike the Arduino IDE, which is beginner-friendly but limited in features, PlatformIO offers advanced tools like dependency management, multiple environment configurations, and integration with IDEs like CLion, VSCode.
We use PlatformIO because it makes project organization easier, automates library handling, and provides a lot of debugging and testing capabilities, making it ideal for complex or multi-board projects.

### Prerequisites
1. An IDE installed on your machine.
2. **PlatformIO Core (CLI)** installed:
    - Follow the [PlatformIO installation guide](https://docs.platformio.org/en/latest/core/installation.html).

## PlatformIO projects structure

A typical PlatformIO project uses the following structure:

- **`src/`**: Contains the main source code files (`.cpp`).
    - Example: `src/main.cpp`
- **`include/`**: For additional header files (`.h`) used in the project.
- **`lib/`**: For custom libraries specific to a project.
- **`.pio/`**: PlatformIO’s build directory (generated after the first build). Not versioned in Git.
- **`test/`**: Contains unit tests.
- **`platformio.ini`**: Configuration file, described below

### `platformio.ini`
- This is the main configuration file for the project.
- Defines platforms, frameworks, libraries, and settings.
- Example:
  ```ini
  [env:esp32dev]
  platform = espressif32
  board = esp32dev
  framework = arduino
  lib_deps =
    adafruit/Adafruit BME280 Library
    arduino-libraries/WiFi
  ```



---

## Notes
- Ensure `platformio.ini` is properly configured for your board and environment. 
- Reload the project (Tools > PlatformIO > Reload in CLion) if your IDE does not recognize the PlatformIO project or doesn't detect libraries for example.
- Update the PlatformIO CLI regularly to ensure compatibility:
  ```bash
  pio upgrade
  ```