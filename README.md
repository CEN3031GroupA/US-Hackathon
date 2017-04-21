## Deployed Site: 
https://still-eyrie-27550.herokuapp.com/

## Sources Used:
- MEAN.JS - http://meanjs.org/
- textAngular - https://github.com/textAngular/textAngular
- angular-qr - https://github.com/janantala/angular-qr
- angular-ui-bootstrap-datetimepicker - https://github.com/zhaber/angular-js-bootstrap-datetimepicker

## Features Implemented:
### Welcome screens: 
introduction to the 48 hr. Hackathon application
### Basic authentication:
for two user types: users and admins
### Menu:
A slide out menu that links to all locations of the application to include:
- Home
- Schedule
- Projects
- Ideas
- FAQs
- Admin Home (only visible with admin login)
- Logout
### Home: 
contains the links for submitting and idea or a project and allows access to articles created by admins.  Both projects and ideas can be setup with a title and summary.  Projects can add team members and urls to wesites or youtube content.  Ideas have the ability to become projects if desired.  The event timer is displayed at the top of the page which should be ticking down to the next event or ticking down to the end of the current event in progress.
### Schedule: 
This lists the sub-events of an upcoming Hackathon or sub-events during the current hackathon.  A sub event could be a 	talk, luncheon, or up coming game, etc.
### Projects: 
once a project is created, it will display randomly in a list of projects for users to select from.  Selecting a project takes you to the projects site where you can view active content, see whose on the team, vote for the project, and give feedback in a comment to the team.
### Ideas: 
once an idea is created, it will display randomly in a list of ideas for users to select from.  Selecting an idea takes you to the idea's site where you can review the details of the idea, see the owner, select as a favorite, and give feedback in a comment.  an idea can be made into a project by selecting the make it a project button and completing the project information process.
### FAQs: 
this area will house questions that are asked about anything pertaining to hackathon events.  Questions can be responded to and responses can be marked as solutions.
### Admins Home: 
the admin has access to creating the hackathon events (tied to the timer, ideas and projects submitted).  The admin can develop categories for the event to submit a project to, develop sub-events for a main event, manage previously created events, and see the tallied votes for projects in the current hackathon.  This site also allows the admins to develop and post articles that will display in the home screen for users to read.

## Instructions for Running Locally:
Follow the instructions found on http://meanjs.org/ as this project follows their installation instructions. Once installed, using the command "grunt" on the command-line will start the site and it can be accessed at http://localhost:3000/

## How to Update Database and Server connections:
You can update the database used by updating the following url to point to your new DB:
/config/env/production.js:db.uri

The server that this project is being run on is on heroku. To create a new heroku instance, follow the instructions found here: https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction
