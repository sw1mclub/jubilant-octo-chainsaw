# A TypeScript Uniswap Client with Docker support.

## Setup
Create a file in application/configs called `secret-config.json`. You can follow application/configs/example-config.json.

Configs:
* ethNodeAddress: The IP address and port of the ethereum node you want to connect to
* testNodeAddress: The IP address and port of the ethereum node you want to connect to for testing
* walletAddress: Your ethereum wallet address.
* privateKey: Your ethereum private key.
* usdcTokenAddress: Address for the USDC token contract.
* routerContractAddress: Address for the uniswap router contract.
* chainID: Set to 1 for mainnet.
* chain: Name of the chain to use. "mainnet" for mainnet.

## Using the app
I needed to link the docker container running my node to the bridge network:
* `docker network connect bridge <ethereum node container id>`

To run via docker user the commands
* `docker build -t application .`
* `docker run -it application`

To run the program, run from the application directory `npm run start`

## Running tests
1. Set up you secret-config.json file
2. `npm run test`