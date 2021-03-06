import * as config from '../../configs/test-config.json';
import * as ethers from 'ethers';
import TradeBuilder from '../uniswap';
import BigNumberUtil from '../bignumberutil';

describe("TradeBuilder functions", () => {
    const ethersProvider = new ethers.providers.JsonRpcProvider(config.ethNodeAddress);

    it("should properly create eth to token trade", async () => {
        const ethAmount = 1.234;
        const trade = await TradeBuilder.createEthToUSDCTrade(ethersProvider, ethAmount + "");
        expect(trade.inputAmount.toExact()).toEqual("" + ethAmount);
    });

    it("should properly create token to eth trade", async () => {
        const tokenAmount = 2468;
        const roundedTokenAmount = BigNumberUtil.tokenAmountNumberToString(tokenAmount);
        const trade = await TradeBuilder.createUSDCToEthTrade(ethersProvider, roundedTokenAmount);
        expect(trade.inputAmount.toExact()).toEqual("" + tokenAmount);
    });
});