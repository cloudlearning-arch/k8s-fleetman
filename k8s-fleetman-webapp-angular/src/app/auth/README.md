# Authentication
## Backend
1. ### Sign Up
Connect to Firebase authentication endpoint for sign up
2. ### Sign In
Connect to Firebase authentication endpoint for sign in
## Authentication Page
Youu can switch betwen login or sign up
## Loading Indication
When we login or logout we show a loading spinner.
## Login and Logout
1. ### Sign up
- User can sign up by   his email and password which will be sent to firebase.
- token kept in browser local storage
- User routed to home page
2. ### Login
- User can login by   his email and password which will be sent to firebase.
- token kept in browser local storage
- ### Auto Login
    In the application compoonent we call for auto login to check if there is a user with valid token in the browser local storage, if so we loaded it.
- ### Logout 
    We remove the user from both memory and browser local storage
- ### Auto Logout
    Once user authenticated we have to set a timer to logout if token expires. we check that also when we try to auto login.
## Eror Handling
if login or sign up failed we show that in error area
## Guards
- ### Interceptor
we listen to user which is Observable Subject if it is null by user logout or timer logout
- ### Guard
If user not logged in then we redirect to login page.