import { MetamaskSubprovider, signatureUtils, SignedOrder } from '0x.js';
import { createAction, createAsyncAction } from 'typesafe-actions';

import { ZERO_ADDRESS } from '../../common/constants';
import { cancelSignedOrder } from '../../services/orders';
import { getLogger } from '../../util/logger';
import { isDutchAuction } from '../../util/orders';
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
        const gasOptions = getTransactionOptions(gasPrice);

        let tx;
        if (isDutchAuction(order)) {
            const auctionDetails = await contractWrappers.dutchAuction.getAuctionDetailsAsync(order);
            const currentAuctionAmount = auctionDetails.currentAmount;
            const buyOrder = {
                ...order,
                makerAddress: ethAccount,
                makerAssetData: order.takerAssetData,
                takerAssetData: order.makerAssetData,
                makerAssetAmount: currentAuctionAmount,
                takerAssetAmount: order.makerAssetAmount,
            };

            const provider = new MetamaskSubprovider(web3Wrapper.getProvider());
            const buySignedOrder = await signatureUtils.ecSignOrderAsync(provider, buyOrder, ethAccount);
            tx = await contractWrappers.dutchAuction.matchOrdersAsync(buySignedOrder, order, ethAccount, gasOptions);
        } else {
            tx = await contractWrappers.forwarder.marketBuyOrdersWithEthAsync(
                [order],
                order.makerAssetAmount,
                ethAccount,
                order.takerAssetAmount,
                [],
                0,
                ZERO_ADDRESS,
                gasOptions,
            );
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
