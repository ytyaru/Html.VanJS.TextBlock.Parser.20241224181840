#!/usr/bin/env bash
#FILE_NAME=./download-list-0.txt
FILE_NAME="$1"

while read LINE
do
    wget --wait 2 "https://ems.sh${LINE}"
done < ${FILE_NAME}

