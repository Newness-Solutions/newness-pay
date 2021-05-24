# Fapshi Backend
The backend of fapshi was built using NodeJs and below are the main endpoints and how to use them.

## Usage
After cloning the repo, run npm install

## Key Endpoints
```field* = required field ```
### Registration (localhost:5000/api/auth/signup)

- Request Type: post
- Fields: email*, username*, password*(takes 6 characters or more), roles(an array of roles with user as default value)
- Return: Registration status, successful or failed

### Login (localhost:5000/api/auth/signup)

- Request Type: post
- Fields: email*, username*, password*(takes 6 characters or more)
- Return: 
    - If successful: returns  userdata (id, email, phone etc) and accessToken used to make all subsequent requests
    - Else: returns corresponding error message

```access token is must be added to all requests that need the user to be logged in
it is added in the header of the requests as "accessToken:$lsafjd..."
```
