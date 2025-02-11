#ifndef EMBEDDED_LCD_H
#define EMBEDDED_LCD_H

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

void LCDSetup();
void LCDScroll();
void displayMessage(String text, int milliseconds);
void printLockerLCD(String availableLocker);
void printInteractionLCD(String availableLocker, String transactionType, String userId);

#endif //EMBEDDED_LCD_H