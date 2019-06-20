import { BigNumber } from '0x.js';

export class ConvertBalanceMustNotBeEqualException extends Error {
    constructor(currentEthBalance: BigNumber, newEthBalance: BigNumber) {
        super(
            `Convert ETH/WETH values must not be equal, received: ${currentEthBalance.toString()} and ${newEthBalance.toString()}`,
        );
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ConvertBalanceMustNotBeEqualException.prototype);
    }
}
