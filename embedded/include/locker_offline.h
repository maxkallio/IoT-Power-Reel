#ifndef EMBEDDED_LOCKER_OFFLINE_H
#define EMBEDDED_LOCKER_OFFLINE_H

#include <Arduino.h>

struct Locker {
    int id;
    int pin;  
    String uid;
    bool isFree;
};

extern Locker lockers[];

extern const int numLockers;

void determineTransaction(String uid);
void returnTransaction(String uid);
void lendTransaction(String uid);
void unlockLocker(int lockerIndex);

#endif // EMBEDDED_LOCKER_OFFLINE_H
