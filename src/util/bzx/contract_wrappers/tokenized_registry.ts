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

export type TokenizedRegistryEventArgs = TokenizedRegistryOwnershipTransferredEventArgs;

export enum TokenizedRegistryEvents {
    OwnershipTransferred = 'OwnershipTransferred',
}

export interface TokenizedRegistryOwnershipTransferredEventArgs extends DecodedLogArgs {
    previousOwner: string;
    newOwner: string;
}

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class TokenizedRegistryContract extends BaseContract {
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
            const self = (this as any) as TokenizedRegistryContract;
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
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('owner()', []);
            return abiEncodedTransactionData;
        },
    };
    public tokens = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[string, string, string, string, BigNumber, BigNumber]> {
            assert.isString('index_0', index_0);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('tokens(address)', [index_0.toLowerCase()]);
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
            const abiEncoder = self._lookupAbiEncoder('tokens(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[string, string, string, string, BigNumber, BigNumber]>(
                rawCallResult,
            );
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(index_0: string): string {
            assert.isString('index_0', index_0);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('tokens(address)', [index_0.toLowerCase()]);
            return abiEncodedTransactionData;
        },
    };
    public tokenAddresses = {
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
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('tokenAddresses(uint256)', [index_0]);
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
            const abiEncoder = self._lookupAbiEncoder('tokenAddresses(uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(index_0: BigNumber): string {
            assert.isBigNumber('index_0', index_0);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('tokenAddresses(uint256)', [index_0]);
            return abiEncodedTransactionData;
        },
    };
    public transferOwnership = {
        async sendTransactionAsync(_newOwner: string, txData?: Partial<TxData> | undefined): Promise<string> {
            assert.isString('_newOwner', _newOwner);
            const self = (this as any) as TokenizedRegistryContract;
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
            const self = (this as any) as TokenizedRegistryContract;
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
            const self = (this as any) as TokenizedRegistryContract;
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
            const self = (this as any) as TokenizedRegistryContract;
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
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('transferOwnership(address)', [
                _newOwner.toLowerCase(),
            ]);
            return abiEncodedTransactionData;
        },
    };
    public addTokens = {
        async sendTransactionAsync(
            _tokens: string[],
            _assets: string[],
            _names: string[],
            _symbols: string[],
            _types: BigNumber[],
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isArray('_tokens', _tokens);
            assert.isArray('_assets', _assets);
            assert.isArray('_names', _names);
            assert.isArray('_symbols', _symbols);
            assert.isArray('_types', _types);
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments(
                'addTokens(address[],address[],string[],string[],uint256[])',
                [_tokens, _assets, _names, _symbols, _types],
            );
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                // @ts-ignore
                self.addTokens.estimateGasAsync.bind(self, _tokens, _assets, _names, _symbols, _types),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            _tokens: string[],
            _assets: string[],
            _names: string[],
            _symbols: string[],
            _types: BigNumber[],
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isArray('_tokens', _tokens);
            assert.isArray('_assets', _assets);
            assert.isArray('_names', _names);
            assert.isArray('_symbols', _symbols);
            assert.isArray('_types', _types);
            const self = (this as any) as TokenizedRegistryContract;
            const txHashPromise = self.addTokens.sendTransactionAsync(
                _tokens,
                _assets,
                _names,
                _symbols,
                _types,
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
            _tokens: string[],
            _assets: string[],
            _names: string[],
            _symbols: string[],
            _types: BigNumber[],
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isArray('_tokens', _tokens);
            assert.isArray('_assets', _assets);
            assert.isArray('_names', _names);
            assert.isArray('_symbols', _symbols);
            assert.isArray('_types', _types);
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments(
                'addTokens(address[],address[],string[],string[],uint256[])',
                [_tokens, _assets, _names, _symbols, _types],
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
            _tokens: string[],
            _assets: string[],
            _names: string[],
            _symbols: string[],
            _types: BigNumber[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void> {
            assert.isArray('_tokens', _tokens);
            assert.isArray('_assets', _assets);
            assert.isArray('_names', _names);
            assert.isArray('_symbols', _symbols);
            assert.isArray('_types', _types);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments(
                'addTokens(address[],address[],string[],string[],uint256[])',
                [_tokens, _assets, _names, _symbols, _types],
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
            const abiEncoder = self._lookupAbiEncoder('addTokens(address[],address[],string[],string[],uint256[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(
            _tokens: string[],
            _assets: string[],
            _names: string[],
            _symbols: string[],
            _types: BigNumber[],
        ): string {
            assert.isArray('_tokens', _tokens);
            assert.isArray('_assets', _assets);
            assert.isArray('_names', _names);
            assert.isArray('_symbols', _symbols);
            assert.isArray('_types', _types);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments(
                'addTokens(address[],address[],string[],string[],uint256[])',
                [_tokens, _assets, _names, _symbols, _types],
            );
            return abiEncodedTransactionData;
        },
    };
    public removeTokens = {
        async sendTransactionAsync(_tokens: string[], txData?: Partial<TxData> | undefined): Promise<string> {
            assert.isArray('_tokens', _tokens);
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('removeTokens(address[])', [_tokens]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.removeTokens.estimateGasAsync.bind(self, _tokens),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            _tokens: string[],
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isArray('_tokens', _tokens);
            const self = (this as any) as TokenizedRegistryContract;
            const txHashPromise = self.removeTokens.sendTransactionAsync(_tokens, txData);
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
        async estimateGasAsync(_tokens: string[], txData?: Partial<TxData> | undefined): Promise<number> {
            assert.isArray('_tokens', _tokens);
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('removeTokens(address[])', [_tokens]);
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
        async callAsync(_tokens: string[], callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
            assert.isArray('_tokens', _tokens);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('removeTokens(address[])', [_tokens]);
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
            const abiEncoder = self._lookupAbiEncoder('removeTokens(address[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_tokens: string[]): string {
            assert.isArray('_tokens', _tokens);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('removeTokens(address[])', [_tokens]);
            return abiEncodedTransactionData;
        },
    };
    public addToken = {
        async sendTransactionAsync(
            _token: string,
            _asset: string,
            _name: string,
            _symbol: string,
            _type: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isString('_token', _token);
            assert.isString('_asset', _asset);
            assert.isString('_name', _name);
            assert.isString('_symbol', _symbol);
            assert.isBigNumber('_type', _type);
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('addToken(address,address,string,string,uint256)', [
                _token.toLowerCase(),
                _asset.toLowerCase(),
                _name,
                _symbol,
                _type,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                // @ts-ignore
                self.addToken.estimateGasAsync.bind(
                    self,
                    _token.toLowerCase(),
                    _asset.toLowerCase(),
                    _name,
                    _symbol,
                    _type,
                ),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            _token: string,
            _asset: string,
            _name: string,
            _symbol: string,
            _type: BigNumber,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('_token', _token);
            assert.isString('_asset', _asset);
            assert.isString('_name', _name);
            assert.isString('_symbol', _symbol);
            assert.isBigNumber('_type', _type);
            const self = (this as any) as TokenizedRegistryContract;
            const txHashPromise = self.addToken.sendTransactionAsync(
                _token.toLowerCase(),
                _asset.toLowerCase(),
                _name,
                _symbol,
                _type,
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
            _token: string,
            _asset: string,
            _name: string,
            _symbol: string,
            _type: BigNumber,
            txData?: Partial<TxData> | undefined,
        ): Promise<number> {
            assert.isString('_token', _token);
            assert.isString('_asset', _asset);
            assert.isString('_name', _name);
            assert.isString('_symbol', _symbol);
            assert.isBigNumber('_type', _type);
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('addToken(address,address,string,string,uint256)', [
                _token.toLowerCase(),
                _asset.toLowerCase(),
                _name,
                _symbol,
                _type,
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
            _token: string,
            _asset: string,
            _name: string,
            _symbol: string,
            _type: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void> {
            assert.isString('_token', _token);
            assert.isString('_asset', _asset);
            assert.isString('_name', _name);
            assert.isString('_symbol', _symbol);
            assert.isBigNumber('_type', _type);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('addToken(address,address,string,string,uint256)', [
                _token.toLowerCase(),
                _asset.toLowerCase(),
                _name,
                _symbol,
                _type,
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
            const abiEncoder = self._lookupAbiEncoder('addToken(address,address,string,string,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(
            _token: string,
            _asset: string,
            _name: string,
            _symbol: string,
            _type: BigNumber,
        ): string {
            assert.isString('_token', _token);
            assert.isString('_asset', _asset);
            assert.isString('_name', _name);
            assert.isString('_symbol', _symbol);
            assert.isBigNumber('_type', _type);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments(
                'addToken(address,address,string,string,uint256)',
                [_token.toLowerCase(), _asset.toLowerCase(), _name, _symbol, _type],
            );
            return abiEncodedTransactionData;
        },
    };
    public removeToken = {
        async sendTransactionAsync(_token: string, txData?: Partial<TxData> | undefined): Promise<string> {
            assert.isString('_token', _token);
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('removeToken(address)', [_token.toLowerCase()]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.removeToken.estimateGasAsync.bind(self, _token.toLowerCase()),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            _token: string,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('_token', _token);
            const self = (this as any) as TokenizedRegistryContract;
            const txHashPromise = self.removeToken.sendTransactionAsync(_token.toLowerCase(), txData);
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
        async estimateGasAsync(_token: string, txData?: Partial<TxData> | undefined): Promise<number> {
            assert.isString('_token', _token);
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('removeToken(address)', [_token.toLowerCase()]);
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
        async callAsync(_token: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
            assert.isString('_token', _token);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('removeToken(address)', [_token.toLowerCase()]);
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
            const abiEncoder = self._lookupAbiEncoder('removeToken(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_token: string): string {
            assert.isString('_token', _token);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('removeToken(address)', [
                _token.toLowerCase(),
            ]);
            return abiEncodedTransactionData;
        },
    };
    public setTokenName = {
        async sendTransactionAsync(
            _token: string,
            _name: string,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isString('_token', _token);
            assert.isString('_name', _name);
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('setTokenName(address,string)', [
                _token.toLowerCase(),
                _name,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.setTokenName.estimateGasAsync.bind(self, _token.toLowerCase(), _name),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            _token: string,
            _name: string,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('_token', _token);
            assert.isString('_name', _name);
            const self = (this as any) as TokenizedRegistryContract;
            const txHashPromise = self.setTokenName.sendTransactionAsync(_token.toLowerCase(), _name, txData);
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
        async estimateGasAsync(_token: string, _name: string, txData?: Partial<TxData> | undefined): Promise<number> {
            assert.isString('_token', _token);
            assert.isString('_name', _name);
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('setTokenName(address,string)', [
                _token.toLowerCase(),
                _name,
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
            _token: string,
            _name: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void> {
            assert.isString('_token', _token);
            assert.isString('_name', _name);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('setTokenName(address,string)', [
                _token.toLowerCase(),
                _name,
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
            const abiEncoder = self._lookupAbiEncoder('setTokenName(address,string)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_token: string, _name: string): string {
            assert.isString('_token', _token);
            assert.isString('_name', _name);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setTokenName(address,string)', [
                _token.toLowerCase(),
                _name,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public setTokenSymbol = {
        async sendTransactionAsync(
            _token: string,
            _symbol: string,
            txData?: Partial<TxData> | undefined,
        ): Promise<string> {
            assert.isString('_token', _token);
            assert.isString('_symbol', _symbol);
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('setTokenSymbol(address,string)', [
                _token.toLowerCase(),
                _symbol,
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                self.setTokenSymbol.estimateGasAsync.bind(self, _token.toLowerCase(), _symbol),
            );
            if (txDataWithDefaults.from !== undefined) {
                txDataWithDefaults.from = txDataWithDefaults.from.toLowerCase();
            }

            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        awaitTransactionSuccessAsync(
            _token: string,
            _symbol: string,
            txData?: Partial<TxData>,
            pollingIntervalMs?: number,
            timeoutMs?: number,
        ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
            assert.isString('_token', _token);
            assert.isString('_symbol', _symbol);
            const self = (this as any) as TokenizedRegistryContract;
            const txHashPromise = self.setTokenSymbol.sendTransactionAsync(_token.toLowerCase(), _symbol, txData);
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
        async estimateGasAsync(_token: string, _symbol: string, txData?: Partial<TxData> | undefined): Promise<number> {
            assert.isString('_token', _token);
            assert.isString('_symbol', _symbol);
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('setTokenSymbol(address,string)', [
                _token.toLowerCase(),
                _symbol,
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
            _token: string,
            _symbol: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void> {
            assert.isString('_token', _token);
            assert.isString('_symbol', _symbol);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('setTokenSymbol(address,string)', [
                _token.toLowerCase(),
                _symbol,
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
            const abiEncoder = self._lookupAbiEncoder('setTokenSymbol(address,string)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_token: string, _symbol: string): string {
            assert.isString('_token', _token);
            assert.isString('_symbol', _symbol);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('setTokenSymbol(address,string)', [
                _token.toLowerCase(),
                _symbol,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public getTokenAddressBySymbol = {
        async callAsync(_symbol: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
            assert.isString('_symbol', _symbol);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('getTokenAddressBySymbol(string)', [_symbol]);
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
            const abiEncoder = self._lookupAbiEncoder('getTokenAddressBySymbol(string)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_symbol: string): string {
            assert.isString('_symbol', _symbol);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('getTokenAddressBySymbol(string)', [_symbol]);
            return abiEncodedTransactionData;
        },
    };
    public getTokenAddressByName = {
        async callAsync(_name: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
            assert.isString('_name', _name);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('getTokenAddressByName(string)', [_name]);
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
            const abiEncoder = self._lookupAbiEncoder('getTokenAddressByName(string)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_name: string): string {
            assert.isString('_name', _name);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('getTokenAddressByName(string)', [_name]);
            return abiEncodedTransactionData;
        },
    };
    public getTokenByAddress = {
        async callAsync(
            _token: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<{
            token: string;
            asset: string;
            name: string;
            symbol: string;
            tokenType: BigNumber;
            index: BigNumber;
        }> {
            assert.isString('_token', _token);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('getTokenByAddress(address)', [_token.toLowerCase()]);
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
            const abiEncoder = self._lookupAbiEncoder('getTokenByAddress(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<{
                token: string;
                asset: string;
                name: string;
                symbol: string;
                tokenType: BigNumber;
                index: BigNumber;
            }>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_token: string): string {
            assert.isString('_token', _token);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('getTokenByAddress(address)', [
                _token.toLowerCase(),
            ]);
            return abiEncodedTransactionData;
        },
    };
    public getTokenByName = {
        async callAsync(
            _name: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<{
            token: string;
            asset: string;
            name: string;
            symbol: string;
            tokenType: BigNumber;
            index: BigNumber;
        }> {
            assert.isString('_name', _name);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('getTokenByName(string)', [_name]);
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
            const abiEncoder = self._lookupAbiEncoder('getTokenByName(string)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<{
                token: string;
                asset: string;
                name: string;
                symbol: string;
                tokenType: BigNumber;
                index: BigNumber;
            }>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_name: string): string {
            assert.isString('_name', _name);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('getTokenByName(string)', [_name]);
            return abiEncodedTransactionData;
        },
    };
    public getTokenBySymbol = {
        async callAsync(
            _symbol: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<{
            token: string;
            asset: string;
            name: string;
            symbol: string;
            tokenType: BigNumber;
            index: BigNumber;
        }> {
            assert.isString('_symbol', _symbol);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('getTokenBySymbol(string)', [_symbol]);
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
            const abiEncoder = self._lookupAbiEncoder('getTokenBySymbol(string)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<{
                token: string;
                asset: string;
                name: string;
                symbol: string;
                tokenType: BigNumber;
                index: BigNumber;
            }>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_symbol: string): string {
            assert.isString('_symbol', _symbol);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('getTokenBySymbol(string)', [_symbol]);
            return abiEncodedTransactionData;
        },
    };
    public getTokenAddresses = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string[]> {
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('getTokenAddresses()', []);
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
            const abiEncoder = self._lookupAbiEncoder('getTokenAddresses()');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string[]>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(): string {
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('getTokenAddresses()', []);
            return abiEncodedTransactionData;
        },
    };
    public getTokens = {
        async callAsync(
            _start: BigNumber,
            _count: BigNumber,
            _tokenType: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<
            Array<{
                token: string;
                asset: string;
                name: string;
                symbol: string;
                tokenType: BigNumber;
                index: BigNumber;
            }>
        > {
            assert.isBigNumber('_start', _start);
            assert.isBigNumber('_count', _count);
            assert.isBigNumber('_tokenType', _tokenType);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('getTokens(uint256,uint256,uint256)', [
                _start,
                _count,
                _tokenType,
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
            const abiEncoder = self._lookupAbiEncoder('getTokens(uint256,uint256,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<
                Array<{
                    token: string;
                    asset: string;
                    name: string;
                    symbol: string;
                    tokenType: BigNumber;
                    index: BigNumber;
                }>
            >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_start: BigNumber, _count: BigNumber, _tokenType: BigNumber): string {
            assert.isBigNumber('_start', _start);
            assert.isBigNumber('_count', _count);
            assert.isBigNumber('_tokenType', _tokenType);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('getTokens(uint256,uint256,uint256)', [
                _start,
                _count,
                _tokenType,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public isTokenType = {
        async callAsync(
            _token: string,
            _tokenType: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean> {
            assert.isString('_token', _token);
            assert.isBigNumber('_tokenType', _tokenType);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('isTokenType(address,uint256)', [
                _token.toLowerCase(),
                _tokenType,
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
            const abiEncoder = self._lookupAbiEncoder('isTokenType(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_token: string, _tokenType: BigNumber): string {
            assert.isString('_token', _token);
            assert.isBigNumber('_tokenType', _tokenType);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('isTokenType(address,uint256)', [
                _token.toLowerCase(),
                _tokenType,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public getTokenAsset = {
        async callAsync(
            _token: string,
            _tokenType: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<string> {
            assert.isString('_token', _token);
            assert.isBigNumber('_tokenType', _tokenType);
            assert.doesConformToSchema('callData', callData, schemas.callDataSchema, [
                schemas.addressSchema,
                schemas.numberSchema,
                schemas.jsNumber,
            ]);
            if (defaultBlock !== undefined) {
                assert.isBlockParam('defaultBlock', defaultBlock);
            }
            const self = (this as any) as TokenizedRegistryContract;
            const encodedData = self._strictEncodeArguments('getTokenAsset(address,uint256)', [
                _token.toLowerCase(),
                _tokenType,
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
            const abiEncoder = self._lookupAbiEncoder('getTokenAsset(address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        getABIEncodedTransactionData(_token: string, _tokenType: BigNumber): string {
            assert.isString('_token', _token);
            assert.isBigNumber('_tokenType', _tokenType);
            const self = (this as any) as TokenizedRegistryContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('getTokenAsset(address,uint256)', [
                _token.toLowerCase(),
                _tokenType,
            ]);
            return abiEncodedTransactionData;
        },
    };
    public static async deployFrom0xArtifactAsync(
        artifact: ContractArtifact | SimpleContractArtifact,
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
    ): Promise<TokenizedRegistryContract> {
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
        return TokenizedRegistryContract.deployAsync(bytecode, abi, provider, txDefaults);
    }
    public static async deployAsync(
        bytecode: string,
        abi: ContractAbi,
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
    ): Promise<TokenizedRegistryContract> {
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
        logUtils.log(`TokenizedRegistry successfully deployed at ${txReceipt.contractAddress}`);
        const contractInstance = new TokenizedRegistryContract(
            txReceipt.contractAddress as string,
            provider,
            txDefaults,
        );
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
                inputs: [
                    {
                        name: 'index_0',
                        type: 'address',
                    },
                ],
                name: 'tokens',
                outputs: [
                    {
                        name: 'token',
                        type: 'address',
                    },
                    {
                        name: 'asset',
                        type: 'address',
                    },
                    {
                        name: 'name',
                        type: 'string',
                    },
                    {
                        name: 'symbol',
                        type: 'string',
                    },
                    {
                        name: 'tokenType',
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
                inputs: [
                    {
                        name: 'index_0',
                        type: 'uint256',
                    },
                ],
                name: 'tokenAddresses',
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
                        name: '_tokens',
                        type: 'address[]',
                    },
                    {
                        name: '_assets',
                        type: 'address[]',
                    },
                    {
                        name: '_names',
                        type: 'string[]',
                    },
                    {
                        name: '_symbols',
                        type: 'string[]',
                    },
                    {
                        name: '_types',
                        type: 'uint256[]',
                    },
                ],
                name: 'addTokens',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: '_tokens',
                        type: 'address[]',
                    },
                ],
                name: 'removeTokens',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: '_token',
                        type: 'address',
                    },
                    {
                        name: '_asset',
                        type: 'address',
                    },
                    {
                        name: '_name',
                        type: 'string',
                    },
                    {
                        name: '_symbol',
                        type: 'string',
                    },
                    {
                        name: '_type',
                        type: 'uint256',
                    },
                ],
                name: 'addToken',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: '_token',
                        type: 'address',
                    },
                ],
                name: 'removeToken',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: '_token',
                        type: 'address',
                    },
                    {
                        name: '_name',
                        type: 'string',
                    },
                ],
                name: 'setTokenName',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: false,
                inputs: [
                    {
                        name: '_token',
                        type: 'address',
                    },
                    {
                        name: '_symbol',
                        type: 'string',
                    },
                ],
                name: 'setTokenSymbol',
                outputs: [],
                payable: false,
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                constant: true,
                inputs: [
                    {
                        name: '_symbol',
                        type: 'string',
                    },
                ],
                name: 'getTokenAddressBySymbol',
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
                        name: '_name',
                        type: 'string',
                    },
                ],
                name: 'getTokenAddressByName',
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
                        name: '_token',
                        type: 'address',
                    },
                ],
                name: 'getTokenByAddress',
                outputs: [
                    {
                        name: '',
                        type: 'tuple',
                        components: [
                            {
                                name: 'token',
                                type: 'address',
                            },
                            {
                                name: 'asset',
                                type: 'address',
                            },
                            {
                                name: 'name',
                                type: 'string',
                            },
                            {
                                name: 'symbol',
                                type: 'string',
                            },
                            {
                                name: 'tokenType',
                                type: 'uint256',
                            },
                            {
                                name: 'index',
                                type: 'uint256',
                            },
                        ],
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
                        name: '_name',
                        type: 'string',
                    },
                ],
                name: 'getTokenByName',
                outputs: [
                    {
                        name: '',
                        type: 'tuple',
                        components: [
                            {
                                name: 'token',
                                type: 'address',
                            },
                            {
                                name: 'asset',
                                type: 'address',
                            },
                            {
                                name: 'name',
                                type: 'string',
                            },
                            {
                                name: 'symbol',
                                type: 'string',
                            },
                            {
                                name: 'tokenType',
                                type: 'uint256',
                            },
                            {
                                name: 'index',
                                type: 'uint256',
                            },
                        ],
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
                        name: '_symbol',
                        type: 'string',
                    },
                ],
                name: 'getTokenBySymbol',
                outputs: [
                    {
                        name: '',
                        type: 'tuple',
                        components: [
                            {
                                name: 'token',
                                type: 'address',
                            },
                            {
                                name: 'asset',
                                type: 'address',
                            },
                            {
                                name: 'name',
                                type: 'string',
                            },
                            {
                                name: 'symbol',
                                type: 'string',
                            },
                            {
                                name: 'tokenType',
                                type: 'uint256',
                            },
                            {
                                name: 'index',
                                type: 'uint256',
                            },
                        ],
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
            {
                constant: true,
                inputs: [],
                name: 'getTokenAddresses',
                outputs: [
                    {
                        name: '',
                        type: 'address[]',
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
                        name: '_start',
                        type: 'uint256',
                    },
                    {
                        name: '_count',
                        type: 'uint256',
                    },
                    {
                        name: '_tokenType',
                        type: 'uint256',
                    },
                ],
                name: 'getTokens',
                outputs: [
                    {
                        name: 'tokenData',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'token',
                                type: 'address',
                            },
                            {
                                name: 'asset',
                                type: 'address',
                            },
                            {
                                name: 'name',
                                type: 'string',
                            },
                            {
                                name: 'symbol',
                                type: 'string',
                            },
                            {
                                name: 'tokenType',
                                type: 'uint256',
                            },
                            {
                                name: 'index',
                                type: 'uint256',
                            },
                        ],
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
                        name: '_token',
                        type: 'address',
                    },
                    {
                        name: '_tokenType',
                        type: 'uint256',
                    },
                ],
                name: 'isTokenType',
                outputs: [
                    {
                        name: 'valid',
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
                        name: '_token',
                        type: 'address',
                    },
                    {
                        name: '_tokenType',
                        type: 'uint256',
                    },
                ],
                name: 'getTokenAsset',
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
        ] as ContractAbi;
        return abi;
    }
    constructor(address: string, supportedProvider: SupportedProvider, txDefaults?: Partial<TxData>) {
        super('TokenizedRegistry', TokenizedRegistryContract.ABI(), address, supportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
    }
}

// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
