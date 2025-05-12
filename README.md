# CRUD_API

- Firstly you should download code and then run in terminal: npm install
- Secondly you should run postman for checking response of the app`s requests

## Running CRUD API 
   -  Dev mode: npm run start:dev
   -  Prod mode:  npm run start:prod
   -  Multiple instances:  npm run start:multi


   - Run command and type in postman your requests
   - We have 4 methods to check.
      - GET
         - api/users - We should get all the users
         - api/users/{userId} 
                - We can expect three responses:
                 1. If req is good => status code 200 and response: user info
                      +  If id isnt of instance of UUID => status code 400 and message: Invalid id (must be UUID)
                      + If there is no user with specified id => status code 404  and message: User not found
     - POST 
        - api/users
                - We can expect three responses: 1. If req is good => status code 201 and response: created user info
                                                 2. If request body does not contain required fields => status code 400 and message: You should add required fields: username, age, hobbies
      - PUT                                          
        - api/users/{userId} 
                - We can expect three responses: 1. If req is good => status code 200 and response: changed user info
                                                 2. If id isnt of instance of UUID => status code 400 and message: Invalid id (must be UUID)
                                                 3. If there is no user with specified id => status code 404  and message: User not found
      - DELETE                                           
        - api/users/{userId} 
                - We can expect three responses: 1. If req is good (the user is deleted) => status code 204  
                                                 2. If id isnt of instance of UUID => status code 400 and message: Invalid id (must be UUID)
                                                 3. If there is no user with specified id => status code 404  and message: User not found
  - For non existing routes server would answer with status code 404 and message: Endpoint not found. Type existing endpoint
  - If there are errors on the server side that occur during the processing of a request, there would be status code 500 and message: We have a problem. Error: error instance
## Testing
   -  For testing application, type npm "test"
