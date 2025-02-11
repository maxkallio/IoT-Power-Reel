#include "LCD.h"
#include "api.h"

// Define the amount of lcd characters.
int lcd_Chars = 20;

// Index for the scrolling text.
int placeIndex = 0;

// Set the LCD address to 0x27 for a 16 chars and 2 line display.
LiquidCrystal_I2C lcd(0x27, lcd_Chars, 2);

// Variables used in the functions.
String display_text = "Please scan card.";

// Timer and flag for message display
unsigned long messageDisplayMillis = 0;
unsigned long messageDisplayDuration = 0;
bool isDisplayingMessage = false;

void LCDSetup() {
    // Initialize the LCD
    lcd.init();
    lcd.backlight();
    lcd.setCursor(0, 1);
    lcd.print("Please scan card.");
    lcd.display();
}

void LCDScroll() {
    if (isDisplayingMessage) {
        if (millis() - messageDisplayMillis >= messageDisplayDuration) {
            isDisplayingMessage = false;
        } else {
            return; // exit function
        }
    }

    // Add one to the index to move the text from left to right.
    placeIndex++;
    // If the text reaches the end on the LCD, reset the text.
    if (placeIndex > lcd_Chars) {
        placeIndex = 0;
    }

    lcd.clear();
    lcd.setCursor(0, 1);

    // Cut off text so it will not appear on the next line.
    int devideString = lcd_Chars - placeIndex;
    String tempdisplay_text = display_text.substring(0, devideString);
    String cutOffPartText = display_text.substring(devideString);
    String combinedCutText = cutOffPartText + "   " + tempdisplay_text;

    lcd.print(combinedCutText);
}

void displayMessage(String text, int milliseconds) {
    lcd.clear();
    lcd.print(text);
    isDisplayingMessage = true;
    messageDisplayMillis = millis();
    messageDisplayDuration = milliseconds;
}

void printLockerLCD(String availableLocker) {
    if (availableLocker == "No locker found.") {
        displayMessage("No locker found.", 3000);
    } else {
        displayMessage("Locker " + availableLocker + " unlocked.", 10000);
    }
    placeIndex = 0; // Reset scrolling index
}

void printInteractionLCD(String availableLocker, String transactionType, String userId) {
    // Boolean that tracks if a power reel is inside a locker
    // Add the code to check with a magnet/pressure sensor to set the boolean.
    bool reelInsideLocker = true;
    // Boolean that tracks if the door of a locker is closed.
    // If possible check if the door is closed.
    bool lockerClosed = false;

    if (transactionType == "Lending") {
        // Display that the cable should be taken from the correct locker. Also check if a cable is taken yet.
        displayMessage("Please take the power cable from locker " + availableLocker + ".", 10000);
        while (reelInsideLocker == true) {
            // Check the magnet sensor if a power cable is removed and set the reelInsideLocker variable.
            reelInsideLocker = false;
            // Check if the locker is closed.
            lockerClosed = false;
            // If the door of the locker is closed and the cable is not taken the transaction failed.
            if (lockerClosed == true && reelInsideLocker == true) {
                displayMessage("Door closed without taking cable. Transaction aborted.", 10000);
                // Revert the transaction made in the database.
                revertTransaction(transactionType, availableLocker, userId);
                return;
            }
        }
    }
    else if (transactionType == "Returning") {
        // Display that the cable should be placed inside the correct locker. Also check if a cable is placed yet.
        displayMessage("Please place the power cable in locker " + availableLocker + ".", 10000);
        while (reelInsideLocker == false) {        
            // Check the magnet sensor if a power cable is placed and set the reelInsideLocker variable.
            reelInsideLocker = true;
            // Check if the locker is closed.
            lockerClosed = false;
            // If the door of the locker is closed and the cable is not placed the transaction failed.
            if (lockerClosed == true && reelInsideLocker == false) {
                displayMessage("Door closed without placing cable. Transaction aborted.", 10000);
                // Revert the transaction made in the database.
                revertTransaction(transactionType, availableLocker, userId);
                return;
            }
        }
    }
    else {
        return;
    }
    displayMessage("Please close the door of locker " + availableLocker + ".", 10000);
    while (lockerClosed == false) {         
        // If possible check if the door is closed.
        lockerClosed = true;
    }
    displayMessage("Thank you for using the IoT Power cable station.", 10000);
}