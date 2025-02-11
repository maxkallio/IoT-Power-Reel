# User Experience Flow for the Embedded Locker System

## Overview
The embedded locker system integrates various IoT components such as an RFID card reader, LCD screen, Hall sensor, buzzer, and connectivity modules to provide a seamless and interactive user experience. The system allows users to borrow or return power cables by interacting with lockers.

---
## User Interaction Flow

### 1. **Initialization**
   - **System Boot**:
     - When powered on, the system initializes its components, including the Hall sensor, LCD, buzzer, and connectivity modules.
     - The LCD screen displays a welcome message: `"Please scan card."`

### 2. **RFID Card Interaction**
   - **Card Scan**:
     - The user scans their RFID card at the reader.
     - The buzzer beeps briefly to confirm a successful scan.
     - **If Card is Invalid**:
       - The LCD displays: `"Please register your card."`
       - The system halts further actions until a valid card is scanned.
   - **Backend Validation**:
     - The system communicates with the backend API to authenticate the card and retrieve the user’s details.
     - **Error Handling**:
       - If the user is not found, an error message is displayed on the LCD.

### 3. **Locker Availability Check**
   - **Using the Hall Sensor**:
     - The Hall sensor detects whether a locker is occupied or available by measuring magnetic fields.
     - If the locker is occupied, the LCD shows: `"No power reel available."`
     - If available, the system proceeds to assign a locker.

### 4. **Locker Assignment and Unlocking**
   - **Assigning a Locker**:
     - The system assigns a locker based on user requirements (e.g., borrowing or returning).
     - The assigned locker number is displayed on the LCD: `"Locker X unlocked."`
     - The locker’s LED indicator blinks to help the user locate it.
   - **Unlocking**:
     - The locker is unlocked, and the buzzer activates briefly as a confirmation signal.

### 5. **User Interaction with the Locker**
   - **Borrowing a Cable**:
     - The LCD prompts: `"Please take the power cable from locker X."`
     - The Hall sensor verifies that the cable has been removed.
     - If the locker door is closed without removing the cable, the LCD shows: `"Transaction aborted."` and logs the error.
   - **Returning a Cable**:
     - The LCD prompts: `"Please place the power cable in locker X."`
     - The Hall sensor confirms that the cable has been replaced.
     - If the locker door is closed without replacing the cable, the LCD shows: `"Transaction aborted."` and logs the error.

### 6. **Transaction Completion**
   - **Final Steps**:
     - Once the user completes their action (borrowing or returning), the LCD prompts: `"Please close the door of locker X."`
     - The system waits for the locker door to be securely closed.
     - A thank-you message is displayed: `"Thank you for using the IoT Power cable station."`
   - **Reset**:
     - The system resets to the idle state, ready for the next user.

---

## Feedback Mechanisms

### Visual Feedback
   - **LCD Screen**:
     - Displays real-time messages and instructions, such as "Locker unlocked," "Please scan card," and error messages.
     - Scrolls text for longer messages to ensure readability.
   - **LED Indicators**:
     - Blink to guide the user to the correct locker during a transaction.

### Audio Feedback
   - **Buzzer**:
     - Activates briefly to confirm actions such as card scans and locker unlocks.

### Sensor Feedback
   - **Hall Sensor**:
     - Monitors the presence of magnetic fields to determine locker occupancy and track user actions.

---
# User Experience Flow for the Embedded Locker System

## Overview
The embedded locker system integrates various IoT components such as an RFID card reader, LCD screen, Hall sensor, buzzer, and connectivity modules to provide a seamless and interactive user experience. The system allows users to borrow or return power cables by interacting with lockers.

---

## User Interaction Flow

### 1. **Initialization**
   - **System Boot**:
     - When powered on, the system initializes its components, including the Hall sensor, LCD, buzzer, and connectivity modules.
     - The LCD screen displays a welcome message: `"Please scan card."`

### 2. **RFID Card Interaction**
   - **Card Scan**:
     - The user scans their RFID card at the reader.
     - The buzzer beeps briefly to confirm a successful scan.
     - **If Card is Invalid**:
       - The LCD displays: `"Please register your card."`
       - The system halts further actions until a valid card is scanned.
   - **Backend Validation**:
     - The system communicates with the backend API to authenticate the card and retrieve the user’s details.
     - **Error Handling**:
       - If the user is not found, an error message is displayed on the LCD.

### 3. **Locker Availability Check**
   - **Using the Hall Sensor**:
     - The Hall sensor detects whether a locker is occupied or available by measuring magnetic fields.
     - If the locker is occupied, the LCD shows: `"No power reel available."`
     - If available, the system proceeds to assign a locker.

### 4. **Locker Assignment and Unlocking**
   - **Assigning a Locker**:
     - The system assigns a locker based on user requirements (e.g., borrowing or returning).
     - The assigned locker number is displayed on the LCD: `"Locker X unlocked."`
     - The locker’s LED indicator blinks to help the user locate it.
   - **Unlocking**:
     - The locker is unlocked, and the buzzer activates briefly as a confirmation signal.

### 5. **User Interaction with the Locker**
   - **Borrowing a Cable**:
     - The LCD prompts: `"Please take the power cable from locker X."`
     - The Hall sensor verifies that the cable has been removed.
     - If the locker door is closed without removing the cable, the LCD shows: `"Transaction aborted."` and logs the error.
   - **Returning a Cable**:
     - The LCD prompts: `"Please place the power cable in locker X."`
     - The Hall sensor confirms that the cable has been replaced.
     - If the locker door is closed without replacing the cable, the LCD shows: `"Transaction aborted."` and logs the error.

### 6. **Transaction Completion**
   - **Final Steps**:
     - Once the user completes their action (borrowing or returning), the LCD prompts: `"Please close the door of locker X."`
     - The system waits for the locker door to be securely closed.
     - A thank-you message is displayed: `"Thank you for using the IoT Power cable station."`
   - **Reset**:
     - The system resets to the idle state, ready for the next user.

---

## Feedback Mechanisms

### Visual Feedback
   - **LCD Screen**:
     - Displays real-time messages and instructions, such as "Locker unlocked," "Please scan card," and error messages.
     - Scrolls text for longer messages to ensure readability.
   - **LED Indicators**:
     - Blink to guide the user to the correct locker during a transaction.

### Audio Feedback
   - **Buzzer**:
     - Activates briefly to confirm actions such as card scans and locker unlocks.

### Sensor Feedback
   - **Hall Sensor**:
     - Monitors the presence of magnetic fields to determine locker occupancy and track user actions.

---

## System Reliability

### Offline Mode
   - If WiFi connectivity is lost, the system operates in offline mode using local storage to manage basic transactions.

### Error Logging
   - Logs all errors, such as invalid card scans or failed transactions, for troubleshooting and diagnostics.

---

## Conclusion
The embedded locker system prioritizes a smooth and intuitive user experience by combining hardware components like LCDs, buzzers, and sensors with robust software logic. By providing clear instructions, real-time feedback, and reliable functionality, it ensures that users can borrow or return power cables with ease.

