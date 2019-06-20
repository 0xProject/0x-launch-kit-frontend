import { BigNumber } from '0x.js';
import { getType } from 'typesafe-actions';

import { DEFAULT_ESTIMATED_TRANSACTION_TIME_MS, DEFAULT_GAS_PRICE } from '../../common/constants';
import { BlockchainState, ConvertBalanceState, Web3State } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialBlockchainState: BlockchainState = {
    ethAccount: '',
    web3State: Web3State.Loading,
    tokenBalances: [],
    ethBalance: new BigNumber(0),
    wethTokenBalance: null,
    gasInfo: {
        gasPriceInWei: DEFAULT_GAS_PRICE,
        estimatedTimeMs: DEFAULT_ESTIMATED_TRANSACTION_TIME_MS,
    },
    convertBalanceState: ConvertBalanceState.Success,
};

export function blockchain(state: BlockchainState = initialBlockchainState, action: RootAction): BlockchainState {
    switch (action.type) {
        case getType(actions.setEthAccount):
            return { ...state, ethAccount: action.payload };
        case getType(actions.setWeb3State):
            return { ...state, web3State: action.payload };
        case getType(actions.setTokenBalances):
            return { ...state, tokenBalances: action.payload };
        case getType(actions.setWethTokenBalance):
            return { ...state, wethTokenBalance: action.payload };
        case getType(actions.setGasInfo):
            return { ...state, gasInfo: action.payload };
        case getType(actions.setWethBalance):
            return {
                ...state,
                wethTokenBalance: state.wethTokenBalance
                    ? {
                          ...state.wethTokenBalance,
                          balance: action.payload,
                      }
                    : null,
            };
        case getType(actions.setEthBalance):
            return { ...state, ethBalance: action.payload };
        case getType(actions.convertBalanceStateAsync.request):
            return { ...state, convertBalanceState: ConvertBalanceState.Request };
        case getType(actions.convertBalanceStateAsync.failure):
            return { ...state, convertBalanceState: ConvertBalanceState.Failure };
        case getType(actions.convertBalanceStateAsync.success):
            return { ...state, convertBalanceState: ConvertBalanceState.Success };
        case getType(actions.initializeBlockchainData):
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}
