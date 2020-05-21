import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { createAction, createAsyncAction } from 'typesafe-actions';

import { FEE_PERCENTAGE, FEE_RECIPIENT } from '../../common/constants';
import { cancelSignedOrder } from '../../services/orders';
import { getLogger } from '../../util/logger';
import { calculateWorstCaseProtocolFee, isDutchAuction } from '../../util/orders';
import { getTransactionOptions } from '../../util/transactions';
import { Collectible, ThunkCreator } from '../../util/types';
import { getEthAccount, getGasPriceInWei } from '../selectors';

const logger = getLogger('Collectibles::Actions');

export const fetchAllCollectiblesAsync = createAsyncAction(
    'collectibles/ALL_COLLECTIBLES_fetch_request',
    'collectibles/ALL_COLLECTIBLES_fetch_success',
    'collectibles/ALL_COLLECTIBLES_fetch_failure',
)<
    void,
    {
        collectibles: Collectible[];
    },
    Error
>();

export const selectCollectible = createAction('collectibles/selectCollectible', resolve => {
    return (collectible: Collectible | null) => resolve(collectible);
});

export const getAllCollectibles: ThunkCreator = () => {
    return async (dispatch, getState, { getCollectiblesMetadataGateway, getWeb3Wrapper }) => {
        dispatch(fetchAllCollectiblesAsync.request());
        try {
            const state = getState();
            const ethAccount = getEthAccount(state);
            const collectiblesMetadataGateway = getCollectiblesMetadataGateway();
            const collectibles = await collectiblesMetadataGateway.fetchAllCollectibles(ethAccount);
            dispatch(fetchAllCollectiblesAsync.success({ collectibles }));
        } catch (err) {
            logger.error('There was a problem fetching the collectibles', err);
            dispatch(fetchAllCollectiblesAsync.failure(err));
        }
    };
};

export const submitBuyCollectible: ThunkCreator<Promise<string>> = (order: SignedOrder, ethAccount: string) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const contractWrappers = await getContractWrappers();
        const web3Wrapper = await getWeb3Wrapper();

        const state = getState();
        const gasPrice = getGasPriceInWei(state);
        const protocolFee = calculateWorstCaseProtocolFee([order], gasPrice);

        let tx;
        if (isDutchAuction(order)) {
            throw new Error('DutchAuction currently unsupported');
            // const auctionDetails = await contractWrappers.dutchAuction.getAuctionDetails.callAsync(order);
            // const currentAuctionAmount = auctionDetails.currentAmount;
            // const buyOrder = {
            //     ...order,
            //     makerAddress: ethAccount,
            //     makerAssetData: order.takerAssetData,
            //     takerAssetData: order.makerAssetData,
            //     makerAssetAmount: currentAuctionAmount,
            //     takerAssetAmount: order.makerAssetAmount,
            // };

            // const provider = new MetamaskSubprovider(web3Wrapper.getProvider());
            // const buySignedOrder = await signatureUtils.ecSignOrderAsync(provider, buyOrder, ethAccount);
            // tx = await contractWrappers.dutchAuction.matchOrders.sendTransactionAsync(
            //     buySignedOrder,
            //     order,
            //     buySignedOrder.signature,
            //     order.signature,
            //     { from: ethAccount, value: protocolFee, ...getTransactionOptions(gasPrice) },
            // );
        } else {
            const affiliateFeeAmount = order.takerAssetAmount
                .plus(protocolFee)
                .multipliedBy(FEE_PERCENTAGE)
                .integerValue(BigNumber.ROUND_CEIL);
            tx = await contractWrappers.forwarder
                .marketBuyOrdersWithEth(
                    [order],
                    order.makerAssetAmount,
                    [order.signature],
                    [Web3Wrapper.toBaseUnitAmount(FEE_PERCENTAGE, 18)],
                    [FEE_RECIPIENT],
                )
                .sendTransactionAsync({
                    from: ethAccount,
                    value: order.takerAssetAmount.plus(affiliateFeeAmount).plus(protocolFee),
                    ...getTransactionOptions(gasPrice),
                });
        }
        await web3Wrapper.awaitTransactionSuccessAsync(tx);

        // tslint:disable-next-line:no-floating-promises
        dispatch(getAllCollectibles());
        return tx;
    };
};

export const cancelOrderCollectible: ThunkCreator = (order: any) => {
    return async (dispatch, getState) => {
        const state = getState();
        const gasPrice = getGasPriceInWei(state);

        return cancelSignedOrder(order, gasPrice).then(transaction => {
            // tslint:disable-next-line:no-floating-promises
            dispatch(getAllCollectibles());
        });
    };
};
