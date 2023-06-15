[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/_XpznRuT)
# Exam #1: "CMSmall"

## Student: s317390 FALL SERIGNE CHEIKH TIDIANE SY 

# Server side

## API Server

- POST `/api/login`
  - request parameters: None
  - request body content: 
    <br> An object having a field `"username"` containing the user's username and a field `"password"` containing the user's password <br>
    Exemple: {"username": "user2", "password": "isSecret"}
  - response body content:
    <br> An object having fields `"id"`, `"username"` and `"role"` containing the saved information of the user <br>
    Exemple: {"id": 2, "username": "user2", "role": "regular"}

- GET `/api/verifyAuth`
  - request parameters: None
  - response body content:
    <br> If the user is logged: an object with `"id"` and `"username"` fields. If not logged in it returns a not authenticated error.

- POST `/api/logout`
  - request parameters: None
  - request body content: None
  - response body content: confirmation message
- ...

## Database Tables

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

# Client side


## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...


## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

# Usage info

## Example Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- user1, guess_my_password
- user2, isSecret
- admin@cms.com, secureAdmin
- username, password (plus any other requested info)
