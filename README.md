# A TypeScript Ethereum RPC Client in with Docker support.

## Setup
Create a file in application/configs called `secret-config.json`. You can follow application/configs/example-config.json.

Configs:
* ethNodeAddress: The IP address and port of the ethereum node you want to connect to

## Using the app
To run via docker user the commands
* `docker build -t application .`
*  `docker run -it application`

To run the program, run from the application directory `npm run start`