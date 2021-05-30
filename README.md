# restapi-postgres-nodejs
REST api in nodejs for Postgres database using sequelise

Postman folder contains the postman collection to test api's

- To install dependencies
```
npm i
```

- To run
```
node index.js
```

## Route /user
- GET     - Get all users
- POST    - Add a new user
- DELETE  - Delete all users


## Route /user/:userid
- GET      - Get user details with given userid
- DELETE   - Delete the user with given userid
- PUT      - Updates the user with given userid (updates all the fields)
- PATCH    - Updates the user with given userid 
