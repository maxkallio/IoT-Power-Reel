#ifndef EMBEDDED_LOCKER_H
#define EMBEDDED_LOCKER_H

#include <Arduino.h>
struct Locker {
    int id;
    int pin;
};

const Locker lockers[] = {
    {0, 3},
    {1, 4},
    {2, 5},
    {3, 6}
};

const int numLockers = sizeof(lockers) / sizeof(lockers[0]);

void unlockLocker(int lockerIndex);

#endif //EMBEDDED_LOCKER_H
