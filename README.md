# Robot simulation

Performed robot movement in the board size and not fall off from the table.

#
###### Getting Started
install all dependencies
```sh
npm install
```

#
###### Setup
Create AWS account and change the profile **robotsimulate** in serverless.yml
(To deploy to the AWS by using serverless framework, you need to have an access 'aws_access_key_id' and 'aws_secret_access_key'.)
-eg: file in "C:/Users/xxx/aws/credentials"
```sh 
[robotsimulate]
aws_access_key_id = XXXXXXX...
aws_secret_access_key = XXXXXXX...
```

#
###### Deployment
Deploy all the functions (eg: gateway, lambda, cloudwatch, sqs, dynamodb) into AWS
```sh
serverless deploy
```
> * need manual update the stream (streamFunction event) in serverless.yml and then "serverless deploy" again (due to serverless problem)

#
###### Test & Coverage
Run unit test and generate code coverage report 
```sh
npm run test  
```
> coverage folder is created, open coverage/index.html to view the report

#
###### Architecture Diagram
![Alt text](./architecture.png "Architecture")

#
###### REST API
API for controlling the robot simulation
Refer to the [REST.md](REST.md) file for details

#
###### End-user Test
Using postman to test for API calls.
Please find the collection and run test in "end_user_test" folder.
