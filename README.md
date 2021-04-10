# A TypeScript Ethereum RPC Client in with Docker support.

## Setup
Create a file in application/configs called `secret-config.json`. You can follow application/configs/example-config.json.

Configs:
* ethNodeAddress: The IP address and port of the ethereum node you want to connect to
* testNodeAddress: The IP address and port of the ethereum node you want to connect to for testing
* walletAddress: Your ethereum wallet address.
* privateKey: Your ethereum private key.
* chainID: Set to 1 for mainnet.
* chain: Name of the chain to use. "mainnet" for mainnet.

## Using the app
To run via docker user the commands
* `docker build -t application .`
*  `docker run -it application`

To run the program, run from the application directory `npm run start`