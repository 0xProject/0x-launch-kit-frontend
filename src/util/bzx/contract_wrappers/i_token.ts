/* tslint:disable */
// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma
// tslint:disable:whitespace no-unbound-method no-trailing-whitespace
// tslint:disable:no-unused-variable
import { BaseContract, PromiseWithTransactionHash } from '@0x/base-contract';
import { schemas } from '@0x/json-schemas';
import {
    BlockParam,
    BlockParamLiteral,
    CallData,
    ContractAbi,
    ContractArtifact,
    DecodedLogArgs,
    MethodAbi,
    TransactionReceiptWithDecodedLogs,
    TxData,
    TxDataPayable,
    SupportedProvider,
} from 'ethereum-types';
import { BigNumber, classUtils, logUtils, providerUtils } from '@0x/utils';
import { SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { assert } from '@0x/assert';
import * as ethers from 'ethers';
// tslint:enable:no-unused-variable

export type iTokenEventArgs =
    | iTokenTransferEventArgs
    | iTokenApprovalEventArgs
    | iTokenMintEventArgs
    | iTokenBurnEventArgs
    | iTokenBorrowEventArgs
    | iTokenClaimEventArgs
    | iTokenOwnershipTransferredEventArgs;

export enum iTokenEvents {
    Transfer = 'Transfer',
    Approval = 'Approval',
    Mint = 'Mint',
    Burn = 'Burn',
    Borrow = 'Borrow',
    Claim = 'Claim',
    OwnershipTransferred = 'OwnershipTransferred',
}

export interface iTokenTransferEventArgs extends DecodedLogArgs {
    from: string;
    to: string;
    value: BigNumber;
}

export interface iTokenApprovalEventArgs extends DecodedLogArgs {
    owner: string;
    spender: string;
    value: BigNumber;
}

export interface iTokenMintEventArgs extends DecodedLogArgs {
    minter: string;
    tokenAmount: BigNumber;
    assetAmount: BigNumber;
    price: BigNumber;
}

export interface iTokenBurnEventArgs extends DecodedLogArgs {
    burner: string;
    tokenAmount: BigNumber;
    assetAmount: BigNumber;
    price: BigNumber;
}

export interface iTokenBorrowEventArgs extends DecodedLogArgs {
    borrower: string;
    borrowAmount: BigNumber;
    interestRate: BigNumber;
    collateralTokenAddress: string;
    tradeTokenToFillAddress: string;
    withdrawOnOpen: boolean;
}

export interface iTokenClaimEventArgs extends DecodedLogArgs {
    claimant: string;
    tokenAmount: BigNumber;
    assetAmount: BigNumber;
    remainingTokenAmount: BigNumber;
    price: BigNumber;
}

export interface iTokenOwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class iTokenContract extends BaseContract {
    public name = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('name()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('name()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('name()', []);
            return abiEncodedTransactionData;
        },
    };
    public approve = {
        async sendTransactionAsync(
            _spender: string,
            _value: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_value', _value);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('approve(address,uint256)', [
                _spender.toLowerCase(),
                _value,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.approve.estimateGasAsync.bind(self, _spender.toLowerCase(), _value),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            _spender: string,
            _value: BigNumber,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_value', _value);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.approve.sendTransactionAsync(_spender.toLowerCase(), _value, txData);
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(
            _spender: string,
            _value: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_value', _value);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('approve(address,uint256)', [
                _spender.toLowerCase(),
                _value,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            _spender: string,
            _value: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean> {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_value', _value);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('approve(address,uint256)', [
                _spender.toLowerCase(),
                _value,
            ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('approve(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_spender: string, _value: BigNumber): string {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_value', _value);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('approve(address,uint256)', [
                _spender.toLowerCase(),
                _value,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public burntTokenReserved = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('burntTokenReserved()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('burntTokenReserved()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('burntTokenReserved()', []);
            return abiEncodedTransactionData;
        },
    };
    public totalSupply = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('totalSupply()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('totalSupply()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('totalSupply()', []);
            return abiEncodedTransactionData;
        },
    };
    public initialPrice = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('initialPrice()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('initialPrice()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('initialPrice()', []);
            return abiEncodedTransactionData;
        },
    };
    public baseRate = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('baseRate()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('baseRate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('baseRate()', []);
            return abiEncodedTransactionData;
        },
    };
    public totalAssetBorrow = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('totalAssetBorrow()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('totalAssetBorrow()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('totalAssetBorrow()', []);
            return abiEncodedTransactionData;
        },
    };
    public loanOrderData = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> {
            assert.isString('index_0', index_0);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('loanOrderData(bytes32)', [index_0]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('loanOrderData(bytes32)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<
                [string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
            >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(index_0: string): string {
            assert.isString('index_0', index_0);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('loanOrderData(bytes32)', [index_0]);
            return abiEncodedTransactionData;
        },
    };
    public decimals = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('decimals()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('decimals()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('decimals()', []);
            return abiEncodedTransactionData;
        },
    };
    public rateMultiplier = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('rateMultiplier()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('rateMultiplier()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('rateMultiplier()', []);
            return abiEncodedTransactionData;
        },
    };
    public wethContract = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('wethContract()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('wethContract()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('wethContract()', []);
            return abiEncodedTransactionData;
        },
    };
    public decreaseApproval = {
        async sendTransactionAsync(
            _spender: string,
            _subtractedValue: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_subtractedValue', _subtractedValue);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('decreaseApproval(address,uint256)', [
                _spender.toLowerCase(),
                _subtractedValue,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.decreaseApproval.estimateGasAsync.bind(self, _spender.toLowerCase(), _subtractedValue),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            _spender: string,
            _subtractedValue: BigNumber,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_subtractedValue', _subtractedValue);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.decreaseApproval.sendTransactionAsync(
                _spender.toLowerCase(),
                _subtractedValue,
                txData,
            );
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(
            _spender: string,
            _subtractedValue: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_subtractedValue', _subtractedValue);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('decreaseApproval(address,uint256)', [
                _spender.toLowerCase(),
                _subtractedValue,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            _spender: string,
            _subtractedValue: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean> {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_subtractedValue', _subtractedValue);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('decreaseApproval(address,uint256)', [
                _spender.toLowerCase(),
                _subtractedValue,
            ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('decreaseApproval(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_spender: string, _subtractedValue: BigNumber): string {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_subtractedValue', _subtractedValue);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('decreaseApproval(address,uint256)', [
                _spender.toLowerCase(),
                _subtractedValue,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public balanceOf = {
        async callAsync(
            _owner: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isString('_owner', _owner);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('balanceOf(address)', [_owner.toLowerCase()]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('balanceOf(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_owner: string): string {
            assert.isString('_owner', _owner);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('balanceOf(address)', [_owner.toLowerCase()]);
            return abiEncodedTransactionData;
        },
    };
    public tokenizedRegistry = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('tokenizedRegistry()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('tokenizedRegistry()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('tokenizedRegistry()', []);
            return abiEncodedTransactionData;
        },
    };
    public burntTokenReserveList = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[string, BigNumber]> {
            assert.isBigNumber('index_0', index_0);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('burntTokenReserveList(uint256)', [index_0]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('burntTokenReserveList(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[string, BigNumber]>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(index_0: BigNumber): string {
            assert.isBigNumber('index_0', index_0);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('burntTokenReserveList(uint256)', [index_0]);
            return abiEncodedTransactionData;
        },
    };
    public loanTokenAddress = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('loanTokenAddress()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('loanTokenAddress()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('loanTokenAddress()', []);
            return abiEncodedTransactionData;
        },
    };
    public checkpointSupply = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('checkpointSupply()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('checkpointSupply()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('checkpointSupply()', []);
            return abiEncodedTransactionData;
        },
    };
    public bZxVault = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('bZxVault()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('bZxVault()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('bZxVault()', []);
            return abiEncodedTransactionData;
        },
    };
    public owner = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('owner()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('owner()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('owner()', []);
            return abiEncodedTransactionData;
        },
    };
    public symbol = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('symbol()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('symbol()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('symbol()', []);
            return abiEncodedTransactionData;
        },
    };
    public bZxOracle = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('bZxOracle()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('bZxOracle()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('bZxOracle()', []);
            return abiEncodedTransactionData;
        },
    };
    public bZxContract = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('bZxContract()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('bZxContract()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('bZxContract()', []);
            return abiEncodedTransactionData;
        },
    };
    public leverageList = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isBigNumber('index_0', index_0);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('leverageList(uint256)', [index_0]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('leverageList(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(index_0: BigNumber): string {
            assert.isBigNumber('index_0', index_0);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('leverageList(uint256)', [index_0]);
            return abiEncodedTransactionData;
        },
    };
    public increaseApproval = {
        async sendTransactionAsync(
            _spender: string,
            _addedValue: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_addedValue', _addedValue);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('increaseApproval(address,uint256)', [
                _spender.toLowerCase(),
                _addedValue,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.increaseApproval.estimateGasAsync.bind(self, _spender.toLowerCase(), _addedValue),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            _spender: string,
            _addedValue: BigNumber,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_addedValue', _addedValue);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.increaseApproval.sendTransactionAsync(
                _spender.toLowerCase(),
                _addedValue,
                txData,
            );
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(
            _spender: string,
            _addedValue: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_addedValue', _addedValue);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('increaseApproval(address,uint256)', [
                _spender.toLowerCase(),
                _addedValue,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            _spender: string,
            _addedValue: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean> {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_addedValue', _addedValue);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('increaseApproval(address,uint256)', [
                _spender.toLowerCase(),
                _addedValue,
            ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('increaseApproval(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_spender: string, _addedValue: BigNumber): string {
            assert.isString('_spender', _spender);
            assert.isBigNumber('_addedValue', _addedValue);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('increaseApproval(address,uint256)', [
                _spender.toLowerCase(),
                _addedValue,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public spreadMultiplier = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('spreadMultiplier()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('spreadMultiplier()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('spreadMultiplier()', []);
            return abiEncodedTransactionData;
        },
    };
    public allowance = {
        async callAsync(
            _owner: string,
            _spender: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isString('_owner', _owner);
            assert.isString('_spender', _spender);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('allowance(address,address)', [
                _owner.toLowerCase(),
                _spender.toLowerCase(),
            ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('allowance(address,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_owner: string, _spender: string): string {
            assert.isString('_owner', _owner);
            assert.isString('_spender', _spender);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('allowance(address,address)', [
                _owner.toLowerCase(),
                _spender.toLowerCase(),
            ]);
            return abiEncodedTransactionData;
        },
    };
    public transferOwnership = {
        async sendTransactionAsync(_newOwner: string, txData?: Partial<TxData> | undefined): Promise<string> {
            assert.isString('_newOwner', _newOwner);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('transferOwnership(address)', [_newOwner.toLowerCase()]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.transferOwnership.estimateGasAsync.bind(self, _newOwner.toLowerCase()),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            _newOwner: string,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('_newOwner', _newOwner);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.transferOwnership.sendTransactionAsync(_newOwner.toLowerCase(), txData);
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(_newOwner: string, txData?: Partial<TxData> | undefined): Promise<number> {
            assert.isString('_newOwner', _newOwner);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('transferOwnership(address)', [_newOwner.toLowerCase()]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(_newOwner: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
            assert.isString('_newOwner', _newOwner);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('transferOwnership(address)', [_newOwner.toLowerCase()]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('transferOwnership(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_newOwner: string): string {
            assert.isString('_newOwner', _newOwner);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('transferOwnership(address)', [
                _newOwner.toLowerCase(),
            ]);
            return abiEncodedTransactionData;
        },
    };
    public burntTokenReserveListIndex = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, boolean]> {
            assert.isString('index_0', index_0);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('burntTokenReserveListIndex(address)', [
                index_0.toLowerCase(),
            ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('burntTokenReserveListIndex(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, boolean]>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(index_0: string): string {
            assert.isString('index_0', index_0);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('burntTokenReserveListIndex(address)', [
                index_0.toLowerCase(),
            ]);
            return abiEncodedTransactionData;
        },
    };
    public loanOrderHashes = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string> {
            assert.isBigNumber('index_0', index_0);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('loanOrderHashes(uint256)', [index_0]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('loanOrderHashes(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(index_0: BigNumber): string {
            assert.isBigNumber('index_0', index_0);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('loanOrderHashes(uint256)', [index_0]);
            return abiEncodedTransactionData;
        },
    };
    public mintWithEther = {
        async sendTransactionAsync(receiver: string, txData?: Partial<TxData> | undefined): Promise<string> {
            assert.isString('receiver', receiver);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('mintWithEther(address)', [receiver.toLowerCase()]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.mintWithEther.estimateGasAsync.bind(self, receiver.toLowerCase()),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            receiver: string,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('receiver', receiver);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.mintWithEther.sendTransactionAsync(receiver.toLowerCase(), txData);
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(receiver: string, txData?: Partial<TxData> | undefined): Promise<number> {
            assert.isString('receiver', receiver);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('mintWithEther(address)', [receiver.toLowerCase()]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            receiver: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isString('receiver', receiver);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('mintWithEther(address)', [receiver.toLowerCase()]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('mintWithEther(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(receiver: string): string {
            assert.isString('receiver', receiver);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('mintWithEther(address)', [
                receiver.toLowerCase(),
            ]);
            return abiEncodedTransactionData;
        },
    };
    public mint = {
        async sendTransactionAsync(
            receiver: string,
            depositAmount: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isString('receiver', receiver);
            assert.isBigNumber('depositAmount', depositAmount);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('mint(address,uint256)', [
                receiver.toLowerCase(),
                depositAmount,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.mint.estimateGasAsync.bind(self, receiver.toLowerCase(), depositAmount),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            receiver: string,
            depositAmount: BigNumber,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('receiver', receiver);
            assert.isBigNumber('depositAmount', depositAmount);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.mint.sendTransactionAsync(receiver.toLowerCase(), depositAmount, txData);
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(
            receiver: string,
            depositAmount: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isString('receiver', receiver);
            assert.isBigNumber('depositAmount', depositAmount);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('mint(address,uint256)', [
                receiver.toLowerCase(),
                depositAmount,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            receiver: string,
            depositAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isString('receiver', receiver);
            assert.isBigNumber('depositAmount', depositAmount);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('mint(address,uint256)', [
                receiver.toLowerCase(),
                depositAmount,
            ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('mint(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(receiver: string, depositAmount: BigNumber): string {
            assert.isString('receiver', receiver);
            assert.isBigNumber('depositAmount', depositAmount);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('mint(address,uint256)', [
                receiver.toLowerCase(),
                depositAmount,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public burnToEther = {
        async sendTransactionAsync(
            receiver: string,
            burnAmount: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isString('receiver', receiver);
            assert.isBigNumber('burnAmount', burnAmount);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('burnToEther(address,uint256)', [
                receiver.toLowerCase(),
                burnAmount,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.burnToEther.estimateGasAsync.bind(self, receiver.toLowerCase(), burnAmount),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            receiver: string,
            burnAmount: BigNumber,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('receiver', receiver);
            assert.isBigNumber('burnAmount', burnAmount);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.burnToEther.sendTransactionAsync(receiver.toLowerCase(), burnAmount, txData);
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(
            receiver: string,
            burnAmount: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isString('receiver', receiver);
            assert.isBigNumber('burnAmount', burnAmount);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('burnToEther(address,uint256)', [
                receiver.toLowerCase(),
                burnAmount,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            receiver: string,
            burnAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isString('receiver', receiver);
            assert.isBigNumber('burnAmount', burnAmount);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('burnToEther(address,uint256)', [
                receiver.toLowerCase(),
                burnAmount,
            ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('burnToEther(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(receiver: string, burnAmount: BigNumber): string {
            assert.isString('receiver', receiver);
            assert.isBigNumber('burnAmount', burnAmount);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('burnToEther(address,uint256)', [
                receiver.toLowerCase(),
                burnAmount,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public burn = {
        async sendTransactionAsync(
            receiver: string,
            burnAmount: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isString('receiver', receiver);
            assert.isBigNumber('burnAmount', burnAmount);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('burn(address,uint256)', [
                receiver.toLowerCase(),
                burnAmount,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.burn.estimateGasAsync.bind(self, receiver.toLowerCase(), burnAmount),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            receiver: string,
            burnAmount: BigNumber,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('receiver', receiver);
            assert.isBigNumber('burnAmount', burnAmount);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.burn.sendTransactionAsync(receiver.toLowerCase(), burnAmount, txData);
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(
            receiver: string,
            burnAmount: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isString('receiver', receiver);
            assert.isBigNumber('burnAmount', burnAmount);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('burn(address,uint256)', [
                receiver.toLowerCase(),
                burnAmount,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            receiver: string,
            burnAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isString('receiver', receiver);
            assert.isBigNumber('burnAmount', burnAmount);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('burn(address,uint256)', [
                receiver.toLowerCase(),
                burnAmount,
            ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('burn(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(receiver: string, burnAmount: BigNumber): string {
            assert.isString('receiver', receiver);
            assert.isBigNumber('burnAmount', burnAmount);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('burn(address,uint256)', [
                receiver.toLowerCase(),
                burnAmount,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public borrowTokenFromDeposit = {
        async sendTransactionAsync(
            borrowAmount: BigNumber,
            leverageAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            borrower: string,
            collateralTokenAddress: string,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('initialLoanDuration', initialLoanDuration);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isString('borrower', borrower);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'borrowTokenFromDeposit(uint256,uint256,uint256,uint256,address,address)',
                [
                    borrowAmount,
                    leverageAmount,
                    initialLoanDuration,
                    collateralTokenSent,
                    borrower.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                ],
            );
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                // @ts-ignore
                self.borrowTokenFromDeposit.estimateGasAsync.bind(
                    self,
                    borrowAmount,
                    leverageAmount,
                    initialLoanDuration,
                    collateralTokenSent,
                    borrower.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                ),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            borrowAmount: BigNumber,
            leverageAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            borrower: string,
            collateralTokenAddress: string,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('initialLoanDuration', initialLoanDuration);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isString('borrower', borrower);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.borrowTokenFromDeposit.sendTransactionAsync(
                borrowAmount,
                leverageAmount,
                initialLoanDuration,
                collateralTokenSent,
                borrower.toLowerCase(),
                collateralTokenAddress.toLowerCase(),
                txData,
            );
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(
            borrowAmount: BigNumber,
            leverageAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            borrower: string,
            collateralTokenAddress: string,
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('initialLoanDuration', initialLoanDuration);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isString('borrower', borrower);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'borrowTokenFromDeposit(uint256,uint256,uint256,uint256,address,address)',
                [
                    borrowAmount,
                    leverageAmount,
                    initialLoanDuration,
                    collateralTokenSent,
                    borrower.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                ],
            );
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            borrowAmount: BigNumber,
            leverageAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            borrower: string,
            collateralTokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string> {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('initialLoanDuration', initialLoanDuration);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isString('borrower', borrower);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'borrowTokenFromDeposit(uint256,uint256,uint256,uint256,address,address)',
                [
                    borrowAmount,
                    leverageAmount,
                    initialLoanDuration,
                    collateralTokenSent,
                    borrower.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                ],
            );
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder(
                'borrowTokenFromDeposit(uint256,uint256,uint256,uint256,address,address)',
            );
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(
            borrowAmount: BigNumber,
            leverageAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            borrower: string,
            collateralTokenAddress: string,
        ): string {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('initialLoanDuration', initialLoanDuration);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isString('borrower', borrower);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments(
                'borrowTokenFromDeposit(uint256,uint256,uint256,uint256,address,address)',
                [
                    borrowAmount,
                    leverageAmount,
                    initialLoanDuration,
                    collateralTokenSent,
                    borrower.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                ],
            );
            return abiEncodedTransactionData;
        },
    };
    public borrowTokenAndUse = {
        async sendTransactionAsync(
            borrowAmount: BigNumber,
            leverageAmount: BigNumber,
            interestInitialAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            borrower: string,
            collateralTokenAddress: string,
            tradeTokenAddress: string,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('interestInitialAmount', interestInitialAmount);
            assert.isBigNumber('loanTokenSent', loanTokenSent);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isBigNumber('tradeTokenSent', tradeTokenSent);
            assert.isString('borrower', borrower);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            assert.isString('tradeTokenAddress', tradeTokenAddress);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'borrowTokenAndUse(uint256,uint256,uint256,uint256,uint256,uint256,address,address,address)',
                [
                    borrowAmount,
                    leverageAmount,
                    interestInitialAmount,
                    loanTokenSent,
                    collateralTokenSent,
                    tradeTokenSent,
                    borrower.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                    tradeTokenAddress.toLowerCase(),
                ],
            );
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                // @ts-ignore
                self.borrowTokenAndUse.estimateGasAsync.bind(
                    self,
                    borrowAmount,
                    leverageAmount,
                    interestInitialAmount,
                    loanTokenSent,
                    collateralTokenSent,
                    tradeTokenSent,
                    borrower.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                    tradeTokenAddress.toLowerCase(),
                ),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            borrowAmount: BigNumber,
            leverageAmount: BigNumber,
            interestInitialAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            borrower: string,
            collateralTokenAddress: string,
            tradeTokenAddress: string,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('interestInitialAmount', interestInitialAmount);
            assert.isBigNumber('loanTokenSent', loanTokenSent);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isBigNumber('tradeTokenSent', tradeTokenSent);
            assert.isString('borrower', borrower);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            assert.isString('tradeTokenAddress', tradeTokenAddress);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.borrowTokenAndUse.sendTransactionAsync(
                borrowAmount,
                leverageAmount,
                interestInitialAmount,
                loanTokenSent,
                collateralTokenSent,
                tradeTokenSent,
                borrower.toLowerCase(),
                collateralTokenAddress.toLowerCase(),
                tradeTokenAddress.toLowerCase(),
                txData,
            );
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(
            borrowAmount: BigNumber,
            leverageAmount: BigNumber,
            interestInitialAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            borrower: string,
            collateralTokenAddress: string,
            tradeTokenAddress: string,
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('interestInitialAmount', interestInitialAmount);
            assert.isBigNumber('loanTokenSent', loanTokenSent);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isBigNumber('tradeTokenSent', tradeTokenSent);
            assert.isString('borrower', borrower);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            assert.isString('tradeTokenAddress', tradeTokenAddress);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'borrowTokenAndUse(uint256,uint256,uint256,uint256,uint256,uint256,address,address,address)',
                [
                    borrowAmount,
                    leverageAmount,
                    interestInitialAmount,
                    loanTokenSent,
                    collateralTokenSent,
                    tradeTokenSent,
                    borrower.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                    tradeTokenAddress.toLowerCase(),
                ],
            );
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            borrowAmount: BigNumber,
            leverageAmount: BigNumber,
            interestInitialAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            borrower: string,
            collateralTokenAddress: string,
            tradeTokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string> {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('interestInitialAmount', interestInitialAmount);
            assert.isBigNumber('loanTokenSent', loanTokenSent);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isBigNumber('tradeTokenSent', tradeTokenSent);
            assert.isString('borrower', borrower);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            assert.isString('tradeTokenAddress', tradeTokenAddress);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'borrowTokenAndUse(uint256,uint256,uint256,uint256,uint256,uint256,address,address,address)',
                [
                    borrowAmount,
                    leverageAmount,
                    interestInitialAmount,
                    loanTokenSent,
                    collateralTokenSent,
                    tradeTokenSent,
                    borrower.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                    tradeTokenAddress.toLowerCase(),
                ],
            );
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder(
                'borrowTokenAndUse(uint256,uint256,uint256,uint256,uint256,uint256,address,address,address)',
            );
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(
            borrowAmount: BigNumber,
            leverageAmount: BigNumber,
            interestInitialAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            borrower: string,
            collateralTokenAddress: string,
            tradeTokenAddress: string,
        ): string {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('interestInitialAmount', interestInitialAmount);
            assert.isBigNumber('loanTokenSent', loanTokenSent);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isBigNumber('tradeTokenSent', tradeTokenSent);
            assert.isString('borrower', borrower);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            assert.isString('tradeTokenAddress', tradeTokenAddress);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments(
                'borrowTokenAndUse(uint256,uint256,uint256,uint256,uint256,uint256,address,address,address)',
                [
                    borrowAmount,
                    leverageAmount,
                    interestInitialAmount,
                    loanTokenSent,
                    collateralTokenSent,
                    tradeTokenSent,
                    borrower.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                    tradeTokenAddress.toLowerCase(),
                ],
            );
            return abiEncodedTransactionData;
        },
    };
    public marginTradeFromDeposit = {
        async sendTransactionAsync(
            depositAmount: BigNumber,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            trader: string,
            depositTokenAddress: string,
            collateralTokenAddress: string,
            tradeTokenAddress: string,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isBigNumber('depositAmount', depositAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('loanTokenSent', loanTokenSent);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isBigNumber('tradeTokenSent', tradeTokenSent);
            assert.isString('trader', trader);
            assert.isString('depositTokenAddress', depositTokenAddress);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            assert.isString('tradeTokenAddress', tradeTokenAddress);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'marginTradeFromDeposit(uint256,uint256,uint256,uint256,uint256,address,address,address,address)',
                [
                    depositAmount,
                    leverageAmount,
                    loanTokenSent,
                    collateralTokenSent,
                    tradeTokenSent,
                    trader.toLowerCase(),
                    depositTokenAddress.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                    tradeTokenAddress.toLowerCase(),
                ],
            );
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                // @ts-ignore
                self.marginTradeFromDeposit.estimateGasAsync.bind(
                    self,
                    depositAmount,
                    leverageAmount,
                    loanTokenSent,
                    collateralTokenSent,
                    tradeTokenSent,
                    trader.toLowerCase(),
                    depositTokenAddress.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                    tradeTokenAddress.toLowerCase(),
                ),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            depositAmount: BigNumber,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            trader: string,
            depositTokenAddress: string,
            collateralTokenAddress: string,
            tradeTokenAddress: string,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isBigNumber('depositAmount', depositAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('loanTokenSent', loanTokenSent);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isBigNumber('tradeTokenSent', tradeTokenSent);
            assert.isString('trader', trader);
            assert.isString('depositTokenAddress', depositTokenAddress);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            assert.isString('tradeTokenAddress', tradeTokenAddress);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.marginTradeFromDeposit.sendTransactionAsync(
                depositAmount,
                leverageAmount,
                loanTokenSent,
                collateralTokenSent,
                tradeTokenSent,
                trader.toLowerCase(),
                depositTokenAddress.toLowerCase(),
                collateralTokenAddress.toLowerCase(),
                tradeTokenAddress.toLowerCase(),
                txData,
            );
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(
            depositAmount: BigNumber,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            trader: string,
            depositTokenAddress: string,
            collateralTokenAddress: string,
            tradeTokenAddress: string,
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isBigNumber('depositAmount', depositAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('loanTokenSent', loanTokenSent);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isBigNumber('tradeTokenSent', tradeTokenSent);
            assert.isString('trader', trader);
            assert.isString('depositTokenAddress', depositTokenAddress);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            assert.isString('tradeTokenAddress', tradeTokenAddress);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'marginTradeFromDeposit(uint256,uint256,uint256,uint256,uint256,address,address,address,address)',
                [
                    depositAmount,
                    leverageAmount,
                    loanTokenSent,
                    collateralTokenSent,
                    tradeTokenSent,
                    trader.toLowerCase(),
                    depositTokenAddress.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                    tradeTokenAddress.toLowerCase(),
                ],
            );
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            depositAmount: BigNumber,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            trader: string,
            depositTokenAddress: string,
            collateralTokenAddress: string,
            tradeTokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string> {
            assert.isBigNumber('depositAmount', depositAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('loanTokenSent', loanTokenSent);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isBigNumber('tradeTokenSent', tradeTokenSent);
            assert.isString('trader', trader);
            assert.isString('depositTokenAddress', depositTokenAddress);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            assert.isString('tradeTokenAddress', tradeTokenAddress);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'marginTradeFromDeposit(uint256,uint256,uint256,uint256,uint256,address,address,address,address)',
                [
                    depositAmount,
                    leverageAmount,
                    loanTokenSent,
                    collateralTokenSent,
                    tradeTokenSent,
                    trader.toLowerCase(),
                    depositTokenAddress.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                    tradeTokenAddress.toLowerCase(),
                ],
            );
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder(
                'marginTradeFromDeposit(uint256,uint256,uint256,uint256,uint256,address,address,address,address)',
            );
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(
            depositAmount: BigNumber,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            trader: string,
            depositTokenAddress: string,
            collateralTokenAddress: string,
            tradeTokenAddress: string,
        ): string {
            assert.isBigNumber('depositAmount', depositAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('loanTokenSent', loanTokenSent);
            assert.isBigNumber('collateralTokenSent', collateralTokenSent);
            assert.isBigNumber('tradeTokenSent', tradeTokenSent);
            assert.isString('trader', trader);
            assert.isString('depositTokenAddress', depositTokenAddress);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            assert.isString('tradeTokenAddress', tradeTokenAddress);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments(
                'marginTradeFromDeposit(uint256,uint256,uint256,uint256,uint256,address,address,address,address)',
                [
                    depositAmount,
                    leverageAmount,
                    loanTokenSent,
                    collateralTokenSent,
                    tradeTokenSent,
                    trader.toLowerCase(),
                    depositTokenAddress.toLowerCase(),
                    collateralTokenAddress.toLowerCase(),
                    tradeTokenAddress.toLowerCase(),
                ],
            );
            return abiEncodedTransactionData;
        },
    };
    public claimLoanToken = {
        async sendTransactionAsync(txData?: Partial<TxData> | undefined): Promise<string> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('claimLoanToken()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.claimLoanToken.estimateGasAsync.bind(self),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.claimLoanToken.sendTransactionAsync(txData);
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(txData?: Partial<TxData> | undefined): Promise<number> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('claimLoanToken()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('claimLoanToken()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('claimLoanToken()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('claimLoanToken()', []);
            return abiEncodedTransactionData;
        },
    };
    public wrapEther = {
        async sendTransactionAsync(txData?: Partial<TxData> | undefined): Promise<string> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('wrapEther()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.wrapEther.estimateGasAsync.bind(self),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.wrapEther.sendTransactionAsync(txData);
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(txData?: Partial<TxData> | undefined): Promise<number> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('wrapEther()', []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('wrapEther()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('wrapEther()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('wrapEther()', []);
            return abiEncodedTransactionData;
        },
    };
    public donateAsset = {
        async sendTransactionAsync(tokenAddress: string, txData?: Partial<TxData> | undefined): Promise<string> {
            assert.isString('tokenAddress', tokenAddress);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('donateAsset(address)', [tokenAddress.toLowerCase()]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.donateAsset.estimateGasAsync.bind(self, tokenAddress.toLowerCase()),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            tokenAddress: string,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('tokenAddress', tokenAddress);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.donateAsset.sendTransactionAsync(tokenAddress.toLowerCase(), txData);
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(tokenAddress: string, txData?: Partial<TxData> | undefined): Promise<number> {
            assert.isString('tokenAddress', tokenAddress);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('donateAsset(address)', [tokenAddress.toLowerCase()]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            tokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean> {
            assert.isString('tokenAddress', tokenAddress);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('donateAsset(address)', [tokenAddress.toLowerCase()]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('donateAsset(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(tokenAddress: string): string {
            assert.isString('tokenAddress', tokenAddress);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('donateAsset(address)', [
                tokenAddress.toLowerCase(),
            ]);
            return abiEncodedTransactionData;
        },
    };
    public transfer = {
        async sendTransactionAsync(
            _to: string,
            _value: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isString('_to', _to);
            assert.isBigNumber('_value', _value);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('transfer(address,uint256)', [_to.toLowerCase(), _value]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.transfer.estimateGasAsync.bind(self, _to.toLowerCase(), _value),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            _to: string,
            _value: BigNumber,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('_to', _to);
            assert.isBigNumber('_value', _value);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.transfer.sendTransactionAsync(_to.toLowerCase(), _value, txData);
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(_to: string, _value: BigNumber, txData?: Partial<TxData> | undefined): Promise<number> {
            assert.isString('_to', _to);
            assert.isBigNumber('_value', _value);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('transfer(address,uint256)', [_to.toLowerCase(), _value]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            _to: string,
            _value: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean> {
            assert.isString('_to', _to);
            assert.isBigNumber('_value', _value);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('transfer(address,uint256)', [_to.toLowerCase(), _value]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('transfer(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_to: string, _value: BigNumber): string {
            assert.isString('_to', _to);
            assert.isBigNumber('_value', _value);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('transfer(address,uint256)', [
                _to.toLowerCase(),
                _value,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public transferFrom = {
        async sendTransactionAsync(
            _from: string,
            _to: string,
            _value: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isString('_from', _from);
            assert.isString('_to', _to);
            assert.isBigNumber('_value', _value);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('transferFrom(address,address,uint256)', [
                _from.toLowerCase(),
                _to.toLowerCase(),
                _value,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.transferFrom.estimateGasAsync.bind(self, _from.toLowerCase(), _to.toLowerCase(), _value),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            _from: string,
            _to: string,
            _value: BigNumber,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('_from', _from);
            assert.isString('_to', _to);
            assert.isBigNumber('_value', _value);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.transferFrom.sendTransactionAsync(
                _from.toLowerCase(),
                _to.toLowerCase(),
                _value,
                txData,
            );
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(
            _from: string,
            _to: string,
            _value: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isString('_from', _from);
            assert.isString('_to', _to);
            assert.isBigNumber('_value', _value);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('transferFrom(address,address,uint256)', [
                _from.toLowerCase(),
                _to.toLowerCase(),
                _value,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            _from: string,
            _to: string,
            _value: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean> {
            assert.isString('_from', _from);
            assert.isString('_to', _to);
            assert.isBigNumber('_value', _value);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('transferFrom(address,address,uint256)', [
                _from.toLowerCase(),
                _to.toLowerCase(),
                _value,
            ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('transferFrom(address,address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_from: string, _to: string, _value: BigNumber): string {
            assert.isString('_from', _from);
            assert.isString('_to', _to);
            assert.isBigNumber('_value', _value);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('transferFrom(address,address,uint256)', [
                _from.toLowerCase(),
                _to.toLowerCase(),
                _value,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public tokenPrice = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('tokenPrice()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('tokenPrice()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('tokenPrice()', []);
            return abiEncodedTransactionData;
        },
    };
    public checkpointPrice = {
        async callAsync(
            _user: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isString('_user', _user);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('checkpointPrice(address)', [_user.toLowerCase()]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('checkpointPrice(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_user: string): string {
            assert.isString('_user', _user);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('checkpointPrice(address)', [
                _user.toLowerCase(),
            ]);
            return abiEncodedTransactionData;
        },
    };
    public totalReservedSupply = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('totalReservedSupply()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('totalReservedSupply()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('totalReservedSupply()', []);
            return abiEncodedTransactionData;
        },
    };
    public marketLiquidity = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('marketLiquidity()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('marketLiquidity()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('marketLiquidity()', []);
            return abiEncodedTransactionData;
        },
    };
    public supplyInterestRate = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('supplyInterestRate()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('supplyInterestRate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('supplyInterestRate()', []);
            return abiEncodedTransactionData;
        },
    };
    public avgBorrowInterestRate = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('avgBorrowInterestRate()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('avgBorrowInterestRate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('avgBorrowInterestRate()', []);
            return abiEncodedTransactionData;
        },
    };
    public borrowInterestRate = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('borrowInterestRate()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('borrowInterestRate()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('borrowInterestRate()', []);
            return abiEncodedTransactionData;
        },
    };
    public nextBorrowInterestRate = {
        async callAsync(
            borrowAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('nextBorrowInterestRate(uint256)', [borrowAmount]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('nextBorrowInterestRate(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(borrowAmount: BigNumber): string {
            assert.isBigNumber('borrowAmount', borrowAmount);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('nextBorrowInterestRate(uint256)', [
                borrowAmount,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public nextLoanInterestRate = {
        async callAsync(
            borrowAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('nextLoanInterestRate(uint256)', [borrowAmount]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('nextLoanInterestRate(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(borrowAmount: BigNumber): string {
            assert.isBigNumber('borrowAmount', borrowAmount);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('nextLoanInterestRate(uint256)', [
                borrowAmount,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public nextSupplyInterestRate = {
        async callAsync(
            supplyAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isBigNumber('supplyAmount', supplyAmount);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('nextSupplyInterestRate(uint256)', [supplyAmount]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('nextSupplyInterestRate(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(supplyAmount: BigNumber): string {
            assert.isBigNumber('supplyAmount', supplyAmount);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('nextSupplyInterestRate(uint256)', [
                supplyAmount,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public totalAssetSupply = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('totalAssetSupply()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('totalAssetSupply()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('totalAssetSupply()', []);
            return abiEncodedTransactionData;
        },
    };
    public getMaxEscrowAmount = {
        async callAsync(
            leverageAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('getMaxEscrowAmount(uint256)', [leverageAmount]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('getMaxEscrowAmount(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(leverageAmount: BigNumber): string {
            assert.isBigNumber('leverageAmount', leverageAmount);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('getMaxEscrowAmount(uint256)', [
                leverageAmount,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public getLeverageList = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber[]> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('getLeverageList()', []);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('getLeverageList()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber[]>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('getLeverageList()', []);
            return abiEncodedTransactionData;
        },
    };
    public assetBalanceOf = {
        async callAsync(
            _owner: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isString('_owner', _owner);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('assetBalanceOf(address)', [_owner.toLowerCase()]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('assetBalanceOf(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_owner: string): string {
            assert.isString('_owner', _owner);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('assetBalanceOf(address)', [
                _owner.toLowerCase(),
            ]);
            return abiEncodedTransactionData;
        },
    };
    public getDepositAmountForBorrow = {
        async callAsync(
            borrowAmount: BigNumber,
            leverageAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('initialLoanDuration', initialLoanDuration);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'getDepositAmountForBorrow(uint256,uint256,uint256,address)',
                [borrowAmount, leverageAmount, initialLoanDuration, collateralTokenAddress.toLowerCase()],
            );
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('getDepositAmountForBorrow(uint256,uint256,uint256,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(
            borrowAmount: BigNumber,
            leverageAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenAddress: string,
        ): string {
            assert.isBigNumber('borrowAmount', borrowAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('initialLoanDuration', initialLoanDuration);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments(
                'getDepositAmountForBorrow(uint256,uint256,uint256,address)',
                [borrowAmount, leverageAmount, initialLoanDuration, collateralTokenAddress.toLowerCase()],
            );
            return abiEncodedTransactionData;
        },
    };
    public getBorrowAmountForDeposit = {
        async callAsync(
            depositAmount: BigNumber,
            leverageAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isBigNumber('depositAmount', depositAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('initialLoanDuration', initialLoanDuration);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'getBorrowAmountForDeposit(uint256,uint256,uint256,address)',
                [depositAmount, leverageAmount, initialLoanDuration, collateralTokenAddress.toLowerCase()],
            );
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('getBorrowAmountForDeposit(uint256,uint256,uint256,address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(
            depositAmount: BigNumber,
            leverageAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenAddress: string,
        ): string {
            assert.isBigNumber('depositAmount', depositAmount);
            assert.isBigNumber('leverageAmount', leverageAmount);
            assert.isBigNumber('initialLoanDuration', initialLoanDuration);
            assert.isString('collateralTokenAddress', collateralTokenAddress);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments(
                'getBorrowAmountForDeposit(uint256,uint256,uint256,address)',
                [depositAmount, leverageAmount, initialLoanDuration, collateralTokenAddress.toLowerCase()],
            );
            return abiEncodedTransactionData;
        },
    };
    public _supplyInterestRate = {
        async callAsync(
            assetSupply: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            assert.isBigNumber('assetSupply', assetSupply);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('_supplyInterestRate(uint256)', [assetSupply]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('_supplyInterestRate(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(assetSupply: BigNumber): string {
            assert.isBigNumber('assetSupply', assetSupply);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('_supplyInterestRate(uint256)', [
                assetSupply,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public closeLoanNotifier = {
        async sendTransactionAsync(
            loanOrder: {
                loanTokenAddress: string;
                interestTokenAddress: string;
                collateralTokenAddress: string;
                oracleAddress: string;
                loanTokenAmount: BigNumber;
                interestAmount: BigNumber;
                initialMarginAmount: BigNumber;
                maintenanceMarginAmount: BigNumber;
                maxDurationUnixTimestampSec: BigNumber;
                loanOrderHash: string;
            },
            loanPosition: {
                trader: string;
                collateralTokenAddressFilled: string;
                positionTokenAddressFilled: string;
                loanTokenAmountFilled: BigNumber;
                loanTokenAmountUsed: BigNumber;
                collateralTokenAmountFilled: BigNumber;
                positionTokenAmountFilled: BigNumber;
                loanStartUnixTimestampSec: BigNumber;
                loanEndUnixTimestampSec: BigNumber;
                active: boolean;
                positionId: BigNumber;
            },
            loanCloser: string,
            closeAmount: BigNumber,
            index_4: boolean,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isString('loanCloser', loanCloser);
            assert.isBigNumber('closeAmount', closeAmount);
            assert.isBoolean('index_4', index_4);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'closeLoanNotifier((address,address,address,address,uint256,uint256,uint256,uint256,uint256,bytes32),(address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bool,uint256),address,uint256,bool)',
                [loanOrder, loanPosition, loanCloser.toLowerCase(), closeAmount, index_4],
            );
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                // @ts-ignore
                self.closeLoanNotifier.estimateGasAsync.bind(
                    self,
                    loanOrder,
                    loanPosition,
                    loanCloser.toLowerCase(),
                    closeAmount,
                    index_4,
                ),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            loanOrder: {
                loanTokenAddress: string;
                interestTokenAddress: string;
                collateralTokenAddress: string;
                oracleAddress: string;
                loanTokenAmount: BigNumber;
                interestAmount: BigNumber;
                initialMarginAmount: BigNumber;
                maintenanceMarginAmount: BigNumber;
                maxDurationUnixTimestampSec: BigNumber;
                loanOrderHash: string;
            },
            loanPosition: {
                trader: string;
                collateralTokenAddressFilled: string;
                positionTokenAddressFilled: string;
                loanTokenAmountFilled: BigNumber;
                loanTokenAmountUsed: BigNumber;
                collateralTokenAmountFilled: BigNumber;
                positionTokenAmountFilled: BigNumber;
                loanStartUnixTimestampSec: BigNumber;
                loanEndUnixTimestampSec: BigNumber;
                active: boolean;
                positionId: BigNumber;
            },
            loanCloser: string,
            closeAmount: BigNumber,
            index_4: boolean,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('loanCloser', loanCloser);
            assert.isBigNumber('closeAmount', closeAmount);
            assert.isBoolean('index_4', index_4);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.closeLoanNotifier.sendTransactionAsync(
                loanOrder,
                loanPosition,
                loanCloser.toLowerCase(),
                closeAmount,
                index_4,
                txData,
            );
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(
            loanOrder: {
                loanTokenAddress: string;
                interestTokenAddress: string;
                collateralTokenAddress: string;
                oracleAddress: string;
                loanTokenAmount: BigNumber;
                interestAmount: BigNumber;
                initialMarginAmount: BigNumber;
                maintenanceMarginAmount: BigNumber;
                maxDurationUnixTimestampSec: BigNumber;
                loanOrderHash: string;
            },
            loanPosition: {
                trader: string;
                collateralTokenAddressFilled: string;
                positionTokenAddressFilled: string;
                loanTokenAmountFilled: BigNumber;
                loanTokenAmountUsed: BigNumber;
                collateralTokenAmountFilled: BigNumber;
                positionTokenAmountFilled: BigNumber;
                loanStartUnixTimestampSec: BigNumber;
                loanEndUnixTimestampSec: BigNumber;
                active: boolean;
                positionId: BigNumber;
            },
            loanCloser: string,
            closeAmount: BigNumber,
            index_4: boolean,
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isString('loanCloser', loanCloser);
            assert.isBigNumber('closeAmount', closeAmount);
            assert.isBoolean('index_4', index_4);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'closeLoanNotifier((address,address,address,address,uint256,uint256,uint256,uint256,uint256,bytes32),(address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bool,uint256),address,uint256,bool)',
                [loanOrder, loanPosition, loanCloser.toLowerCase(), closeAmount, index_4],
            );
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            loanOrder: {
                loanTokenAddress: string;
                interestTokenAddress: string;
                collateralTokenAddress: string;
                oracleAddress: string;
                loanTokenAmount: BigNumber;
                interestAmount: BigNumber;
                initialMarginAmount: BigNumber;
                maintenanceMarginAmount: BigNumber;
                maxDurationUnixTimestampSec: BigNumber;
                loanOrderHash: string;
            },
            loanPosition: {
                trader: string;
                collateralTokenAddressFilled: string;
                positionTokenAddressFilled: string;
                loanTokenAmountFilled: BigNumber;
                loanTokenAmountUsed: BigNumber;
                collateralTokenAmountFilled: BigNumber;
                positionTokenAmountFilled: BigNumber;
                loanStartUnixTimestampSec: BigNumber;
                loanEndUnixTimestampSec: BigNumber;
                active: boolean;
                positionId: BigNumber;
            },
            loanCloser: string,
            closeAmount: BigNumber,
            index_4: boolean,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean> {
            assert.isString('loanCloser', loanCloser);
            assert.isBigNumber('closeAmount', closeAmount);
            assert.isBoolean('index_4', index_4);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments(
                'closeLoanNotifier((address,address,address,address,uint256,uint256,uint256,uint256,uint256,bytes32),(address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bool,uint256),address,uint256,bool)',
                [loanOrder, loanPosition, loanCloser.toLowerCase(), closeAmount, index_4],
            );
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder(
                'closeLoanNotifier((address,address,address,address,uint256,uint256,uint256,uint256,uint256,bytes32),(address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bool,uint256),address,uint256,bool)',
            );
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(
            loanOrder: {
                loanTokenAddress: string;
                interestTokenAddress: string;
                collateralTokenAddress: string;
                oracleAddress: string;
                loanTokenAmount: BigNumber;
                interestAmount: BigNumber;
                initialMarginAmount: BigNumber;
                maintenanceMarginAmount: BigNumber;
                maxDurationUnixTimestampSec: BigNumber;
                loanOrderHash: string;
            },
            loanPosition: {
                trader: string;
                collateralTokenAddressFilled: string;
                positionTokenAddressFilled: string;
                loanTokenAmountFilled: BigNumber;
                loanTokenAmountUsed: BigNumber;
                collateralTokenAmountFilled: BigNumber;
                positionTokenAmountFilled: BigNumber;
                loanStartUnixTimestampSec: BigNumber;
                loanEndUnixTimestampSec: BigNumber;
                active: boolean;
                positionId: BigNumber;
            },
            loanCloser: string,
            closeAmount: BigNumber,
            index_4: boolean,
        ): string {
            assert.isString('loanCloser', loanCloser);
            assert.isBigNumber('closeAmount', closeAmount);
            assert.isBoolean('index_4', index_4);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments(
                'closeLoanNotifier((address,address,address,address,uint256,uint256,uint256,uint256,uint256,bytes32),(address,address,address,uint256,uint256,uint256,uint256,uint256,uint256,bool,uint256),address,uint256,bool)',
                [loanOrder, loanPosition, loanCloser.toLowerCase(), closeAmount, index_4],
            );
            return abiEncodedTransactionData;
        },
    };
    public updateSettings = {
        async sendTransactionAsync(
            settingsTarget: string,
            txnData: string,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isString('settingsTarget', settingsTarget);
            assert.isString('txnData', txnData);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('updateSettings(address,bytes)', [
                settingsTarget.toLowerCase(),
                txnData,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.updateSettings.estimateGasAsync.bind(self, settingsTarget.toLowerCase(), txnData),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            settingsTarget: string,
            txnData: string,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('settingsTarget', settingsTarget);
            assert.isString('txnData', txnData);
            const self = (this as any) as iTokenContract;
            const txHashPromise = self.updateSettings.sendTransactionAsync(
                settingsTarget.toLowerCase(),
                txnData,
                txData,
            );
            return new PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs>(
                txHashPromise,
                (async (): Promise<TransactionReceiptWithDecodedLogs> => {
                    // When the transaction hash resolves, wait for it to be mined.
                    return self._web3Wrapper.awaitTransactionSuccessAsync(
                        await txHashPromise,
                        pollingIntervalMs,
                        timeoutMs,
                    );
                })(),
            );
        },
        async estimateGasAsync(
            settingsTarget: string,
            txnData: string,
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isString('settingsTarget', settingsTarget);
            assert.isString('txnData', txnData);
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('updateSettings(address,bytes)', [
                settingsTarget.toLowerCase(),
                txnData,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        async callAsync(
            settingsTarget: string,
            txnData: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void> {
            assert.isString('settingsTarget', settingsTarget);
            assert.isString('txnData', txnData);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments('updateSettings(address,bytes)', [
                settingsTarget.toLowerCase(),
                txnData,
            ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            callDataWithDefaults.from = callDataWithDefaults.from
                ? callDataWithDefaults.from.toLowerCase()
                : callDataWithDefaults.from;

            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('updateSettings(address,bytes)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(settingsTarget: string, txnData: string): string {
            assert.isString('settingsTarget', settingsTarget);
            assert.isString('txnData', txnData);
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('updateSettings(address,bytes)', [
                settingsTarget.toLowerCase(),
                txnData,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public static async deployFrom0xArtifactAsync(
        artifact: ContractArtifact | SimpleContractArtifact,
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
    ): Promise<iTokenContract> {
        assert.doesConformToSchema('txDefaults', txDefaults, schemas.txDataSchema, [
            schemas.addressSchema,
            schemas.numberSchema,
            schemas.jsNumber,
        ]);
        if (artifact.compilerOutput === undefined) {
            throw new Error('Compiler output not found in the artifact file');
        }
        const provider = providerUtils.standardizeOrThrow(supportedProvider);
        const bytecode = artifact.compilerOutput.evm.bytecode.object;
        const abi = artifact.compilerOutput.abi;
        return iTokenContract.deployAsync(bytecode, abi, provider, txDefaults);
    }
    public static async deployAsync(
        bytecode: string,
        abi: ContractAbi,
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
    ): Promise<iTokenContract> {
        assert.isHexString('bytecode', bytecode);
        assert.doesConformToSchema('txDefaults', txDefaults, schemas.txDataSchema, [
            schemas.addressSchema,
            schemas.numberSchema,
            schemas.jsNumber,
        ]);
        const provider = providerUtils.standardizeOrThrow(supportedProvider);
        const constructorAbi = BaseContract._lookupConstructorAbi(abi);
        [] = BaseContract._formatABIDataItemList(constructorAbi.inputs, [], BaseContract._bigNumberToString);
        const iface = new ethers.utils.Interface(abi);
        const deployInfo = iface.deployFunction;
        const txData = deployInfo.encode(bytecode, []);
        const web3Wrapper = new Web3Wrapper(provider);
        const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
            { data: txData },
            txDefaults,
            web3Wrapper.estimateGasAsync.bind(web3Wrapper),
        );
        const txHash = await web3Wrapper.sendTransactionAsync(txDataWithDefaults);
        logUtils.log(`transactionHash: ${txHash}`);
        const txReceipt = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
        logUtils.log(`iToken successfully deployed at ${txReceipt.contractAddress}`);
        const contractInstance = new iTokenContract(txReceipt.contractAddress as string, provider, txDefaults);
        contractInstance.constructorArgs = [];
        return contractInstance;
    }

    /**
     * @returns      The contract ABI
     */
    public static ABI(): ContractAbi {
        const abi = [
            {
                constant: true,
                inputs: [],
                name: 'name',
                outputs: [
                    {
                        name: '',
                        type: 'string',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: '_spender',
                        type: 'address',
                    },
                    {
                        name: '_value',
                        type: 'uint256',
                    },
                ],
                name: 'approve',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'burntTokenReserved',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'totalSupply',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'initialPrice',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'baseRate',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'totalAssetBorrow',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'bytes32',
                    },
                ],
                name: 'loanOrderData',
                outputs: [
                    {
                        name: 'loanOrderHash',
                        type: 'bytes32',
                    },
                    {
                        name: 'leverageAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'initialMarginAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'maintenanceMarginAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'maxDurationUnixTimestampSec',
                        type: 'uint256',
                    },
                    {
                        name: 'index',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'decimals',
                outputs: [
                    {
                        name: '',
                        type: 'uint8',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'rateMultiplier',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'wethContract',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: '_spender',
                        type: 'address',
                    },
                    {
                        name: '_subtractedValue',
                        type: 'uint256',
                    },
                ],
                name: 'decreaseApproval',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: '_owner',
                        type: 'address',
                    },
                ],
                name: 'balanceOf',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'tokenizedRegistry',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'uint256',
                    },
                ],
                name: 'burntTokenReserveList',
                outputs: [
                    {
                        name: 'lender',
                        type: 'address',
                    },
                    {
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'loanTokenAddress',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'checkpointSupply',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'bZxVault',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'owner',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'symbol',
                outputs: [
                    {
                        name: '',
                        type: 'string',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'bZxOracle',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'bZxContract',
                outputs: [
                    {
                        name: '',
                        type: 'address',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'uint256',
                    },
                ],
                name: 'leverageList',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: '_spender',
                        type: 'address',
                    },
                    {
                        name: '_addedValue',
                        type: 'uint256',
                    },
                ],
                name: 'increaseApproval',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'spreadMultiplier',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: '_owner',
                        type: 'address',
                    },
                    {
                        name: '_spender',
                        type: 'address',
                    },
                ],
                name: 'allowance',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: '_newOwner',
                        type: 'address',
                    },
                ],
                name: 'transferOwnership',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                ],
                name: 'burntTokenReserveListIndex',
                outputs: [
                    {
                        name: 'index',
                        type: 'uint256',
                    },
                    {
                        name: 'isSet',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'index_0',
                        type: 'uint256',
                    },
                ],
                name: 'loanOrderHashes',
                outputs: [
                    {
                        name: '',
                        type: 'bytes32',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                outputs: [],
                payable: true,
                stateMutability: 'payable',
                type: 'fallback',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        name: 'from',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'to',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'value',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'Transfer',
                outputs: [],
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        name: 'owner',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'spender',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'value',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'Approval',
                outputs: [],
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        name: 'minter',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'tokenAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'assetAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'price',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'Mint',
                outputs: [],
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        name: 'burner',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'tokenAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'assetAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'price',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'Burn',
                outputs: [],
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        name: 'borrower',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'borrowAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'interestRate',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'collateralTokenAddress',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'tradeTokenToFillAddress',
                        type: 'address',
                        indexed: false,
                    },
                    {
                        name: 'withdrawOnOpen',
                        type: 'bool',
                        indexed: false,
                    },
                ],
                name: 'Borrow',
                outputs: [],
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        name: 'claimant',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'tokenAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'assetAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'remainingTokenAmount',
                        type: 'uint256',
                        indexed: false,
                    },
                    {
                        name: 'price',
                        type: 'uint256',
                        indexed: false,
                    },
                ],
                name: 'Claim',
                outputs: [],
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    {
                        name: 'previousOwner',
                        type: 'address',
                        indexed: true,
                    },
                    {
                        name: 'newOwner',
                        type: 'address',
                        indexed: true,
                    },
                ],
                name: 'OwnershipTransferred',
                outputs: [],
                type: 'event',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                ],
                name: 'mintWithEther',
                outputs: [
                    {
                        name: 'mintAmount',
                        type: 'uint256',
                    },
                ],
                payable: true,
                stateMutability: 'payable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'depositAmount',
                        type: 'uint256',
                    },
                ],
                name: 'mint',
                outputs: [
                    {
                        name: 'mintAmount',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'burnAmount',
                        type: 'uint256',
                    },
                ],
                name: 'burnToEther',
                outputs: [
                    {
                        name: 'loanAmountPaid',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        name: 'burnAmount',
                        type: 'uint256',
                    },
                ],
                name: 'burn',
                outputs: [
                    {
                        name: 'loanAmountPaid',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'borrowAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'leverageAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'initialLoanDuration',
                        type: 'uint256',
                    },
                    {
                        name: 'collateralTokenSent',
                        type: 'uint256',
                    },
                    {
                        name: 'borrower',
                        type: 'address',
                    },
                    {
                        name: 'collateralTokenAddress',
                        type: 'address',
                    },
                ],
                name: 'borrowTokenFromDeposit',
                outputs: [
                    {
                        name: 'loanOrderHash',
                        type: 'bytes32',
                    },
                ],
                payable: true,
                stateMutability: 'payable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'borrowAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'leverageAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'interestInitialAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'loanTokenSent',
                        type: 'uint256',
                    },
                    {
                        name: 'collateralTokenSent',
                        type: 'uint256',
                    },
                    {
                        name: 'tradeTokenSent',
                        type: 'uint256',
                    },
                    {
                        name: 'borrower',
                        type: 'address',
                    },
                    {
                        name: 'collateralTokenAddress',
                        type: 'address',
                    },
                    {
                        name: 'tradeTokenAddress',
                        type: 'address',
                    },
                ],
                name: 'borrowTokenAndUse',
                outputs: [
                    {
                        name: 'loanOrderHash',
                        type: 'bytes32',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'depositAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'leverageAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'loanTokenSent',
                        type: 'uint256',
                    },
                    {
                        name: 'collateralTokenSent',
                        type: 'uint256',
                    },
                    {
                        name: 'tradeTokenSent',
                        type: 'uint256',
                    },
                    {
                        name: 'trader',
                        type: 'address',
                    },
                    {
                        name: 'depositTokenAddress',
                        type: 'address',
                    },
                    {
                        name: 'collateralTokenAddress',
                        type: 'address',
                    },
                    {
                        name: 'tradeTokenAddress',
                        type: 'address',
                    },
                ],
                name: 'marginTradeFromDeposit',
                outputs: [
                    {
                        name: 'loanOrderHash',
                        type: 'bytes32',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [],
                name: 'claimLoanToken',
                outputs: [
                    {
                        name: 'claimedAmount',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [],
                name: 'wrapEther',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'tokenAddress',
                        type: 'address',
                    },
                ],
                name: 'donateAsset',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: '_to',
                        type: 'address',
                    },
                    {
                        name: '_value',
                        type: 'uint256',
                    },
                ],
                name: 'transfer',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: '_from',
                        type: 'address',
                    },
                    {
                        name: '_to',
                        type: 'address',
                    },
                    {
                        name: '_value',
                        type: 'uint256',
                    },
                ],
                name: 'transferFrom',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'tokenPrice',
                outputs: [
                    {
                        name: 'price',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: '_user',
                        type: 'address',
                    },
                ],
                name: 'checkpointPrice',
                outputs: [
                    {
                        name: 'price',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'totalReservedSupply',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'marketLiquidity',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'supplyInterestRate',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'avgBorrowInterestRate',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'borrowInterestRate',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'borrowAmount',
                        type: 'uint256',
                    },
                ],
                name: 'nextBorrowInterestRate',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'borrowAmount',
                        type: 'uint256',
                    },
                ],
                name: 'nextLoanInterestRate',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'supplyAmount',
                        type: 'uint256',
                    },
                ],
                name: 'nextSupplyInterestRate',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'totalAssetSupply',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'leverageAmount',
                        type: 'uint256',
                    },
                ],
                name: 'getMaxEscrowAmount',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'getLeverageList',
                outputs: [
                    {
                        name: '',
                        type: 'uint256[]',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: '_owner',
                        type: 'address',
                    },
                ],
                name: 'assetBalanceOf',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'borrowAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'leverageAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'initialLoanDuration',
                        type: 'uint256',
                    },
                    {
                        name: 'collateralTokenAddress',
                        type: 'address',
                    },
                ],
                name: 'getDepositAmountForBorrow',
                outputs: [
                    {
                        name: 'depositAmount',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'depositAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'leverageAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'initialLoanDuration',
                        type: 'uint256',
                    },
                    {
                        name: 'collateralTokenAddress',
                        type: 'address',
                    },
                ],
                name: 'getBorrowAmountForDeposit',
                outputs: [
                    {
                        name: 'borrowAmount',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: 'assetSupply',
                        type: 'uint256',
                    },
                ],
                name: '_supplyInterestRate',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'loanOrder',
                        type: 'tuple',
                        components: [
                            {
                                name: 'loanTokenAddress',
                                type: 'address',
                            },
                            {
                                name: 'interestTokenAddress',
                                type: 'address',
                            },
                            {
                                name: 'collateralTokenAddress',
                                type: 'address',
                            },
                            {
                                name: 'oracleAddress',
                                type: 'address',
                            },
                            {
                                name: 'loanTokenAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'interestAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'initialMarginAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'maintenanceMarginAmount',
                                type: 'uint256',
                            },
                            {
                                name: 'maxDurationUnixTimestampSec',
                                type: 'uint256',
                            },
                            {
                                name: 'loanOrderHash',
                                type: 'bytes32',
                            },
                        ],
                    },
                    {
                        name: 'loanPosition',
                        type: 'tuple',
                        components: [
                            {
                                name: 'trader',
                                type: 'address',
                            },
                            {
                                name: 'collateralTokenAddressFilled',
                                type: 'address',
                            },
                            {
                                name: 'positionTokenAddressFilled',
                                type: 'address',
                            },
                            {
                                name: 'loanTokenAmountFilled',
                                type: 'uint256',
                            },
                            {
                                name: 'loanTokenAmountUsed',
                                type: 'uint256',
                            },
                            {
                                name: 'collateralTokenAmountFilled',
                                type: 'uint256',
                            },
                            {
                                name: 'positionTokenAmountFilled',
                                type: 'uint256',
                            },
                            {
                                name: 'loanStartUnixTimestampSec',
                                type: 'uint256',
                            },
                            {
                                name: 'loanEndUnixTimestampSec',
                                type: 'uint256',
                            },
                            {
                                name: 'active',
                                type: 'bool',
                            },
                            {
                                name: 'positionId',
                                type: 'uint256',
                            },
                        ],
                    },
                    {
                        name: 'loanCloser',
                        type: 'address',
                    },
                    {
                        name: 'closeAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'index_4',
                        type: 'bool',
                    },
                ],
                name: 'closeLoanNotifier',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: 'settingsTarget',
                        type: 'address',
                    },
                    {
                        name: 'txnData',
                        type: 'bytes',
                    },
                ],
                name: 'updateSettings',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ] as ContractAbi;
        return abi;
    }
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>) {
        super('iToken', iTokenContract.ABI(), address, supportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
    }
}

// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
