import * as config from '../../configs/test-config.json';
import * as ethers from 'ethers';
import TradeBuilder from '../uniswap';
import Simulator from '../simulator';

describe("Simulator", () => {
    let counter = -1;
    TradeBuilder.getPrices = jest.fn(async (provider: ethers.providers.JsonRpcProvider) => {
        counter++;
        const buyPrices = { wethToUSDC: 2000 + '', usdcToWEth: 1/2000 + ''};
        const sellPrices = { wethToUSDC: 2550 + '', usdcToWEth: 1/2550 + ''};
        if (counter > 14) {
            throw new Error('end of simulation');
        }
        if (counter > 11) {
            return buyPrices;
        }
        if (counter > 8) {
            return sellPrices
        }
        if (counter > 5) {
            return buyPrices
        }
        if (counter > 2) {
            return sellPrices
        }
        return buyPrices
    });

    it("should run a successful trading algorithm", async () => {
        const simulationResult = await Simulator.simulate();
        expect(simulationResult).toEqual({
            eth: 7.199999999999999,
            usdc: 0,
            txnCount: 4, 
        })
    });
});