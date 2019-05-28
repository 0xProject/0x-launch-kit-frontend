export class InsufficientEthDepositBalanceException extends Error {
    constructor(ethBalance: string, ethAmountNeeded: string) {
        super(`You have ${ethBalance} ETH but you need ${ethAmountNeeded} ETH to make this operation`);
    }
}
