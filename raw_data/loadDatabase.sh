#!/bin/bash

# Author: Ryan Sutcliffe CAPSTONE PROJECT
# Description: V1: Load nsccSchedule database objects into MySQL.
# Notes: You might need to chmod 755 to file for it to run at first in terminal. 
# Then just: sudo ./loadDatabase.sh 
# this currently does not quite work?
clear
echo "Creating and Updating mySQL database"
#connect to mysql
mysql -u root -pinet2005 < loadData.sql


