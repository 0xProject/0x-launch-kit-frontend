// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma enum-naming
// tslint:disable:whitespace no-unbound-method no-trailing-whitespace
// tslint:disable:no-unused-variable
import {
    AwaitTransactionSuccessOpts,
    ContractFunctionObj,
    ContractTxFunctionObj,
    SendTransactionOpts,
    BaseContract,
    SubscriptionManager,
    PromiseWithTransactionHash,
    methodAbiToFunctionSignature,
} from '@0x/base-contract';
import { schemas } from '@0x/json-schemas';
import {
    BlockParam,
    BlockParamLiteral,
    BlockRange,
    CallData,
    ContractAbi,
    ContractArtifact,
    DecodedLogArgs,
    LogWithDecodedArgs,
    MethodAbi,
    TransactionReceiptWithDecodedLogs,
    TxData,
    TxDataPayable,
    SupportedProvider,
} from 'ethereum-types';
import { BigNumber, classUtils, logUtils, providerUtils } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
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
    /**
     * @ignore
     */
    public static deployedBytecode: string | undefined;
    public static contractName = 'TokenizedRegistry';
    private readonly _methodABIIndex: { [name: string]: number } = {};
    private readonly _subscriptionManager: SubscriptionManager<TokenizedRegistryEventArgs, TokenizedRegistryEvents>;
    public static async deployFrom0xArtifactAsync(
        artifact: ContractArtifact | SimpleContractArtifact,
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
        logDecodeDependencies: { [contractName: string]: ContractArtifact | SimpleContractArtifact },
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
        const logDecodeDependenciesAbiOnly: { [contractName: string]: ContractAbi } = {};
        if (Object.keys(logDecodeDependencies) !== undefined) {
            for (const key of Object.keys(logDecodeDependencies)) {
                logDecodeDependenciesAbiOnly[key] = logDecodeDependencies[key].compilerOutput.abi;
            }
        }
        return TokenizedRegistryContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly);
    }
    public static async deployAsync(
        bytecode: string,
        abi: ContractAbi,
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
        logDecodeDependencies: { [contractName: string]: ContractAbi },
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
        const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
            {
                data: txData,
                ...txDefaults,
            },
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
            logDecodeDependencies,
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

    public getFunctionSignature(methodName: string): string {
        const index = this._methodABIIndex[methodName];
        const methodAbi = TokenizedRegistryContract.ABI()[index] as MethodAbi; // tslint:disable-line:no-unnecessary-type-assertion
        const functionSignature = methodAbiToFunctionSignature(methodAbi);
        return functionSignature;
    }
    public getABIDecodedTransactionData<T>(methodName: string, callData: string): T {
        const functionSignature = this.getFunctionSignature(methodName);
        const self = (this as any) as TokenizedRegistryContract;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        const abiDecodedCallData = abiEncoder.strictDecode<T>(callData);
        return abiDecodedCallData;
    }
    public getABIDecodedReturnData<T>(methodName: string, callData: string): T {
        const functionSignature = this.getFunctionSignature(methodName);
        const self = (this as any) as TokenizedRegistryContract;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        const abiDecodedCallData = abiEncoder.strictDecodeReturnValue<T>(callData);
        return abiDecodedCallData;
    }
    public getSelector(methodName: string): string {
        const functionSignature = this.getFunctionSignature(methodName);
        const self = (this as any) as TokenizedRegistryContract;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        return abiEncoder.getSelector();
    }

    public owner(): ContractFunctionObj<string> {
        const self = (this as any) as TokenizedRegistryContract;
        const functionSignature = 'owner()';

        return {
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        };
    }
    public tokens(index_0: string): ContractFunctionObj<[string, string, string, string, BigNumber, BigNumber]> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isString('index_0', index_0);
        const functionSignature = 'tokens(address)';

        return {
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<[string, string, string, string, BigNumber, BigNumber]> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<[string, string, string, string, BigNumber, BigNumber]>(
                    rawCallResult,
                );
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()]);
            },
        };
    }
    public tokenAddresses(index_0: BigNumber): ContractFunctionObj<string> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isBigNumber('index_0', index_0);
        const functionSignature = 'tokenAddresses(uint256)';

        return {
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [index_0]);
            },
        };
    }
    public transferOwnership(_newOwner: string): ContractTxFunctionObj<void> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isString('_newOwner', _newOwner);
        const functionSignature = 'transferOwnership(address)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { ...txData, data: this.getABIEncodedTransactionData() },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(txData?: Partial<TxData> | undefined): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
                    ...txData,
                    data: this.getABIEncodedTransactionData(),
                });
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_newOwner.toLowerCase()]);
            },
        };
    }
    public addTokens(
        _tokens: string[],
        _assets: string[],
        _names: string[],
        _symbols: string[],
        _types: BigNumber[],
    ): ContractTxFunctionObj<void> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isArray('_tokens', _tokens);
        assert.isArray('_assets', _assets);
        assert.isArray('_names', _names);
        assert.isArray('_symbols', _symbols);
        assert.isArray('_types', _types);
        const functionSignature = 'addTokens(address[],address[],string[],string[],uint256[])';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { ...txData, data: this.getABIEncodedTransactionData() },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(txData?: Partial<TxData> | undefined): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
                    ...txData,
                    data: this.getABIEncodedTransactionData(),
                });
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_tokens, _assets, _names, _symbols, _types]);
            },
        };
    }
    public removeTokens(_tokens: string[]): ContractTxFunctionObj<void> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isArray('_tokens', _tokens);
        const functionSignature = 'removeTokens(address[])';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { ...txData, data: this.getABIEncodedTransactionData() },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(txData?: Partial<TxData> | undefined): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
                    ...txData,
                    data: this.getABIEncodedTransactionData(),
                });
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_tokens]);
            },
        };
    }
    public addToken(
        _token: string,
        _asset: string,
        _name: string,
        _symbol: string,
        _type: BigNumber,
    ): ContractTxFunctionObj<void> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isString('_token', _token);
        assert.isString('_asset', _asset);
        assert.isString('_name', _name);
        assert.isString('_symbol', _symbol);
        assert.isBigNumber('_type', _type);
        const functionSignature = 'addToken(address,address,string,string,uint256)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { ...txData, data: this.getABIEncodedTransactionData() },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(txData?: Partial<TxData> | undefined): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
                    ...txData,
                    data: this.getABIEncodedTransactionData(),
                });
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [
                    _token.toLowerCase(),
                    _asset.toLowerCase(),
                    _name,
                    _symbol,
                    _type,
                ]);
            },
        };
    }
    public removeToken(_token: string): ContractTxFunctionObj<void> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isString('_token', _token);
        const functionSignature = 'removeToken(address)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { ...txData, data: this.getABIEncodedTransactionData() },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(txData?: Partial<TxData> | undefined): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
                    ...txData,
                    data: this.getABIEncodedTransactionData(),
                });
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_token.toLowerCase()]);
            },
        };
    }
    public setTokenName(_token: string, _name: string): ContractTxFunctionObj<void> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isString('_token', _token);
        assert.isString('_name', _name);
        const functionSignature = 'setTokenName(address,string)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { ...txData, data: this.getABIEncodedTransactionData() },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(txData?: Partial<TxData> | undefined): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
                    ...txData,
                    data: this.getABIEncodedTransactionData(),
                });
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_token.toLowerCase(), _name]);
            },
        };
    }
    public setTokenSymbol(_token: string, _symbol: string): ContractTxFunctionObj<void> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isString('_token', _token);
        assert.isString('_symbol', _symbol);
        const functionSignature = 'setTokenSymbol(address,string)';

        return {
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { ...txData, data: this.getABIEncodedTransactionData() },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(txData?: Partial<TxData> | undefined): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync({
                    ...txData,
                    data: this.getABIEncodedTransactionData(),
                });
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_token.toLowerCase(), _symbol]);
            },
        };
    }
    public getTokenAddressBySymbol(_symbol: string): ContractFunctionObj<string> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isString('_symbol', _symbol);
        const functionSignature = 'getTokenAddressBySymbol(string)';

        return {
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_symbol]);
            },
        };
    }
    public getTokenAddressByName(_name: string): ContractFunctionObj<string> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isString('_name', _name);
        const functionSignature = 'getTokenAddressByName(string)';

        return {
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_name]);
            },
        };
    }
    public getTokenByAddress(
        _token: string,
    ): ContractFunctionObj<{
        token: string;
        asset: string;
        name: string;
        symbol: string;
        tokenType: BigNumber;
        index: BigNumber;
    }> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isString('_token', _token);
        const functionSignature = 'getTokenByAddress(address)';

        return {
            async callAsync(
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
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<{
                    token: string;
                    asset: string;
                    name: string;
                    symbol: string;
                    tokenType: BigNumber;
                    index: BigNumber;
                }>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_token.toLowerCase()]);
            },
        };
    }
    public getTokenByName(
        _name: string,
    ): ContractFunctionObj<{
        token: string;
        asset: string;
        name: string;
        symbol: string;
        tokenType: BigNumber;
        index: BigNumber;
    }> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isString('_name', _name);
        const functionSignature = 'getTokenByName(string)';

        return {
            async callAsync(
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
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<{
                    token: string;
                    asset: string;
                    name: string;
                    symbol: string;
                    tokenType: BigNumber;
                    index: BigNumber;
                }>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_name]);
            },
        };
    }
    public getTokenBySymbol(
        _symbol: string,
    ): ContractFunctionObj<{
        token: string;
        asset: string;
        name: string;
        symbol: string;
        tokenType: BigNumber;
        index: BigNumber;
    }> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isString('_symbol', _symbol);
        const functionSignature = 'getTokenBySymbol(string)';

        return {
            async callAsync(
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
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<{
                    token: string;
                    asset: string;
                    name: string;
                    symbol: string;
                    tokenType: BigNumber;
                    index: BigNumber;
                }>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_symbol]);
            },
        };
    }
    public getTokenAddresses(): ContractFunctionObj<string[]> {
        const self = (this as any) as TokenizedRegistryContract;
        const functionSignature = 'getTokenAddresses()';

        return {
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string[]> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<string[]>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        };
    }
    public getTokens(
        _start: BigNumber,
        _count: BigNumber,
        _tokenType: BigNumber,
    ): ContractFunctionObj<
        Array<{ token: string; asset: string; name: string; symbol: string; tokenType: BigNumber; index: BigNumber }>
    > {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isBigNumber('_start', _start);
        assert.isBigNumber('_count', _count);
        assert.isBigNumber('_tokenType', _tokenType);
        const functionSignature = 'getTokens(uint256,uint256,uint256)';

        return {
            async callAsync(
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
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<
                    Array<{
                        token: string;
                        asset: string;
                        name: string;
                        symbol: string;
                        tokenType: BigNumber;
                        index: BigNumber;
                    }>
                >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_start, _count, _tokenType]);
            },
        };
    }
    public isTokenType(_token: string, _tokenType: BigNumber): ContractFunctionObj<boolean> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isString('_token', _token);
        assert.isBigNumber('_tokenType', _tokenType);
        const functionSignature = 'isTokenType(address,uint256)';

        return {
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<boolean> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_token.toLowerCase(), _tokenType]);
            },
        };
    }
    public getTokenAsset(_token: string, _tokenType: BigNumber): ContractFunctionObj<string> {
        const self = (this as any) as TokenizedRegistryContract;
        assert.isString('_token', _token);
        assert.isBigNumber('_tokenType', _tokenType);
        const functionSignature = 'getTokenAsset(address,uint256)';

        return {
            async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync(
                    { ...callData, data: this.getABIEncodedTransactionData() },
                    defaultBlock,
                );
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                return abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [_token.toLowerCase(), _tokenType]);
            },
        };
    }

    /**
     * Subscribe to an event type emitted by the TokenizedRegistry contract.
     * @param eventName The TokenizedRegistry contract event you would like to subscribe to.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
     * @param callback Callback that gets called when a log is added/removed
     * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
     * @return Subscription token used later to unsubscribe
     */
    public subscribe<ArgsType extends TokenizedRegistryEventArgs>(
        eventName: TokenizedRegistryEvents,
        indexFilterValues: IndexedFilterValues,
        callback: EventCallback<ArgsType>,
        isVerbose: boolean = false,
        blockPollingIntervalMs?: number,
    ): string {
        assert.doesBelongToStringEnum('eventName', eventName, TokenizedRegistryEvents);
        assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
        assert.isFunction('callback', callback);
        const subscriptionToken = this._subscriptionManager.subscribe<ArgsType>(
            this.address,
            eventName,
            indexFilterValues,
            TokenizedRegistryContract.ABI(),
            callback,
            isVerbose,
            blockPollingIntervalMs,
        );
        return subscriptionToken;
    }
    /**
     * Cancel a subscription
     * @param subscriptionToken Subscription token returned by `subscribe()`
     */
    public unsubscribe(subscriptionToken: string): void {
        this._subscriptionManager.unsubscribe(subscriptionToken);
    }
    /**
     * Cancels all existing subscriptions
     */
    public unsubscribeAll(): void {
        this._subscriptionManager.unsubscribeAll();
    }
    /**
     * Gets historical logs without creating a subscription
     * @param eventName The TokenizedRegistry contract event you would like to subscribe to.
     * @param blockRange Block range to get logs from.
     * @param indexFilterValues An object where the keys are indexed args returned by the event and
     * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
     * @return Array of logs that match the parameters
     */
    public async getLogsAsync<ArgsType extends TokenizedRegistryEventArgs>(
        eventName: TokenizedRegistryEvents,
        blockRange: BlockRange,
        indexFilterValues: IndexedFilterValues,
    ): Promise<Array<LogWithDecodedArgs<ArgsType>>> {
        assert.doesBelongToStringEnum('eventName', eventName, TokenizedRegistryEvents);
        assert.doesConformToSchema('blockRange', blockRange, schemas.blockRangeSchema);
        assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
        const logs = await this._subscriptionManager.getLogsAsync<ArgsType>(
            this.address,
            eventName,
            blockRange,
            indexFilterValues,
            TokenizedRegistryContract.ABI(),
        );
        return logs;
    }
    constructor(
        address: string,
        supportedProvider: SupportedProvider,
        txDefaults?: Partial<TxData>,
        logDecodeDependencies?: { [contractName: string]: ContractAbi },
        deployedBytecode: string | undefined = TokenizedRegistryContract.deployedBytecode,
    ) {
        super(
            'TokenizedRegistry',
            TokenizedRegistryContract.ABI(),
            address,
            supportedProvider,
            txDefaults,
            logDecodeDependencies,
            deployedBytecode,
        );
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
        this._subscriptionManager = new SubscriptionManager<TokenizedRegistryEventArgs, TokenizedRegistryEvents>(
            TokenizedRegistryContract.ABI(),
            this._web3Wrapper,
        );
        TokenizedRegistryContract.ABI().forEach((item, index) => {
            if (item.type === 'function') {
                const methodAbi = item as MethodAbi;
                this._methodABIIndex[methodAbi.name] = index;
            }
        });
    }
}

// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
