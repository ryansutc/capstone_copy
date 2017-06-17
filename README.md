# Capstone Project Repository (NSCC Room Scheduling Website)
Student Capstone Course Project at NSCC (Winter 2017)

## Description / Background
This is a website to view rooms in the Nova Scotia Community College (NSCC) Campuses and their availability
based on booking information provided by the college. The website was an experiment with PHP driven web pages
using the Laravel Framework and a mySQL backend database. 

This is an independent copy of the NSCC Schedule Project Repository for archiving purposes. Originally repository was under a fellow students private student repository. To prevent the repository from being lost when that account expires it was recreated here publically for safekeeping. 

This version is slightly updated and tinkered with for optimal displaying here: nsccsucks.xyz

## Initial Setup and Configuration

1. Copy/Fork Repository to a development machine with MySQL, PHP 5+, Composer, Node and NPM installed globally
2. In NsccRoomApp_res folder, Run `Composer Install` to get required PHP Packages, and `NPM Install` to get JS Packages
3. Create/re-create SQL database schema, load/re-load flat textfiles, build/rebuild SQL functions, procedures, views terminal by running `loadDatabase.sh` bash file in terminal. Note: username/password will need to be updated for your MySQL instance on your machine.
4. Configure your .env file for laravel with DB connection parameters and APPKEY information as required.
5. Launch website in an HTTP server with PHP and away you go!


## Credits

Ryan Sutcliffe, Michael Sturdy, Nick Bourque

## License

Go for it.


  
