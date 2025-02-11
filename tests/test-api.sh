#!/bin/bash

BASE_URL="http://localhost/api/get.php"

all_success=true

test_getAvailableLocker() {
    response=$(curl -s -X GET "$BASE_URL?getAvailableLocker")
    success=$(echo "$response" | grep -o '"success":true')
    if [ "$success" ]; then
        echo "getAvailableLocker: succeeded"
    else
        echo "getAvailableLocker: failed."
        all_success=false
    fi
}

test_getAvailableLockerStressTest() {
    all_success=true
    for i in {1..300}; do
        response=$(curl -s -X GET "$BASE_URL?getAvailableLocker")
        success=$(echo "$response" | grep -o '"success":true')
        if [ ! "$success" ]; then
            echo "getAvailableLockerStressTest: failed at test count $i"
            all_success=false
        fi
    done
    if [ "$all_success" = true ]; then
        echo "getAvailableLockerStressTest: succeeded"
    fi
}

test_getCables() {
    response=$(curl -s -X GET "$BASE_URL?getCables")
    success=$(echo "$response" | grep -o '"success":true')
    if [ "$success" ]; then
        echo "getCables: succeeded"
    else
        echo "getCables: failed"
        all_success=false
    fi
}

test_getCablesStressTest() {
    all_success=true
    for i in {1..300}; do
        response=$(curl -s -X GET "$BASE_URL?getCables")
        success=$(echo "$response" | grep -o '"success":true')
        if [ ! "$success" ]; then
            echo "getCablesStressTest: failed at test count $i"
            all_success=false
        fi
    done
    if [ "$all_success" = true ]; then
        echo "getCablesStressTest: succeeded"
    fi
}

test_getUser() {
    user_id=$1
    response=$(curl -s -X GET "$BASE_URL?getUser?parameters:$user_id")
    success=$(echo "$response" | grep -o '"success":true')
    if [ "$success" ]; then
        echo "getUser: succeeded"
    else
        echo "getUser: failed"
        all_success=false
    fi
}

test_getUserStressTest() {
    all_success=true
    for i in {1..300}; do
        response=$(curl -s -X GET "$BASE_URL?getUser?parameters:1")
        success=$(echo "$response" | grep -o '"success":true')
        if [ ! "$success" ]; then
            echo "getUserStressTest: failed at test count $i"
            all_success=false
        fi
    done
    if [ "$all_success" = true ]; then
        echo "getUserStressTest: succeeded"
    fi
}

test_getUser_invalid_id() {
    user_id="abc123"
    response=$(curl -s -X GET "$BASE_URL?getUser?parameters:$user_id")
    success=$(echo "$response" | grep -o '"success":false')
    if [ "$success" ]; then
        echo "getUser (invalid user ID format): succeeded"
    else
        echo "getUser (invalid user ID format): failed"
        all_success=false
    fi
}

test_getUser_nonexistent_found() {
    user_id="999999999999999999999999999999999999999999999999999999999999999" 
    response=$(curl -s -X GET "$BASE_URL?getUser?parameters:$user_id")
    success=$(echo "$response" | grep -o '"success":false')
    if [ "$success" ]; then
        echo "getUser (nonexistent user ID): succeeded"
    else
        echo "getUser (nonexistent user ID): failed"
        all_success=false
    fi
}

test_getUser_no_parameter() {
    response=$(curl -s -X GET "$BASE_URL?getUser")
    success=$(echo "$response" | grep -o '"success":false')
    if [ "$success" ]; then
        echo "getUser (no user ID parameter): succeeded"
    else
        echo "getUser (no user ID parameter): failed"
        all_success=false
    fi
}

test_getAvailableLocker
test_getAvailableLockerStressTest
test_getCables
test_getCablesStressTest
test_getUser "1"
test_getUserStressTest
test_getUser_invalid_id
test_getUser_nonexistent_found
test_getUser_no_parameter

if [ "$all_success" = true ]; then
    echo "All API calls verified successfully."
    exit 0
else
    echo "Some API calls failed. Please check the logs above."
    exit 1
fi

