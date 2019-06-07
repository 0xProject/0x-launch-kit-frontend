import { assetDataUtils, BigNumber } from '0x.js';

import { CollectiblesMetadataGateway } from '../../services/collectibles_metadata_gateway';
import { addressFactory, collectibleFactory } from '../../util/test-utils';

describe('CollectibleMetadataGateway', () => {
    const mockedRelayer: any = {
        getSellCollectibleOrdersAsync: jest.fn().mockResolvedValue([]),
    };
    const mockedSource: any = {
        fetchAllUserCollectiblesAsync: jest.fn(),
        fetchCollectiblesAsync: jest.fn(),
    };

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('User has collectibles, none of them for sale, no other user has collectibles for sell', async () => {
        // given
        const userCollectibles = collectibleFactory.buildList(3);
        const mockedAdd = addressFactory.build().address;
        mockedSource.fetchAllUserCollectiblesAsync.mockResolvedValue(userCollectibles);
        const gateway = new CollectiblesMetadataGateway(mockedRelayer, mockedSource);
        // when
        const result = await gateway.fetchAllCollectibles(mockedAdd);
        // then
        expect(result).toHaveLength(3);
        expect(mockedSource.fetchCollectiblesAsync).not.toBeCalled();
    });

    it('User has collectibles, some of them for sale, no other user has collectibles for sell', async () => {
        // given
        const collectibleAddr = addressFactory.build().address;
        const userCollectibles = collectibleFactory.buildList(3);
        const mockedAdd = addressFactory.build().address;
        mockedSource.fetchAllUserCollectiblesAsync.mockResolvedValue(userCollectibles);
        const order1 = {
            makerAssetData: assetDataUtils.encodeERC721AssetData(
                collectibleAddr,
                new BigNumber(userCollectibles[0].tokenId),
            ),
        };
        const order2 = {
            makerAssetData: assetDataUtils.encodeERC721AssetData(
                collectibleAddr,
                new BigNumber(userCollectibles[1].tokenId),
            ),
        };
        mockedRelayer.getSellCollectibleOrdersAsync.mockResolvedValue([order1, order2]);
        const gateway = new CollectiblesMetadataGateway(mockedRelayer, mockedSource);
        // when
        const result = await gateway.fetchAllCollectibles(mockedAdd);
        // then
        expect(result).toHaveLength(3);

        // @ts-ignore
        expect(result.find(collectible => collectible.tokenId === userCollectibles[0].tokenId).order).toBe(order1);
        // @ts-ignore
        expect(result.find(collectible => collectible.tokenId === userCollectibles[1].tokenId).order).toBe(order2);
        // @ts-ignore
        expect(result.find(collectible => collectible.tokenId === userCollectibles[2].tokenId).order).toBe(null);
        expect(mockedSource.fetchCollectiblesAsync).not.toBeCalled();
    });

    it('User has collectibles, some of them for sale, other user has collectibles for sell', async () => {
        // given
        const collectibleAddr = addressFactory.build().address;
        const userCollectibles = collectibleFactory.buildList(3);
        const otherCollectibles = collectibleFactory.buildList(1);
        const mockedAdd = addressFactory.build().address;
        mockedSource.fetchAllUserCollectiblesAsync.mockResolvedValue(userCollectibles);
        mockedSource.fetchCollectiblesAsync.mockResolvedValue(otherCollectibles);
        const order1 = {
            makerAssetData: assetDataUtils.encodeERC721AssetData(
                collectibleAddr,
                new BigNumber(userCollectibles[0].tokenId),
            ),
        };
        const order2 = {
            makerAssetData: assetDataUtils.encodeERC721AssetData(
                collectibleAddr,
                new BigNumber(userCollectibles[1].tokenId),
            ),
        };
        const order3 = {
            makerAssetData: assetDataUtils.encodeERC721AssetData(
                collectibleAddr,
                new BigNumber(otherCollectibles[0].tokenId),
            ),
        };
        mockedRelayer.getSellCollectibleOrdersAsync.mockResolvedValue([order1, order2, order3]);
        const gateway = new CollectiblesMetadataGateway(mockedRelayer, mockedSource);
        // when
        const result = await gateway.fetchAllCollectibles(mockedAdd);
        // then
        expect(result).toHaveLength(4);

        // @ts-ignore
        expect(result.find(collectible => collectible.tokenId === userCollectibles[0].tokenId).order).toBe(order1);
        // @ts-ignore
        expect(result.find(collectible => collectible.tokenId === userCollectibles[1].tokenId).order).toBe(order2);
        // @ts-ignore
        expect(result.find(collectible => collectible.tokenId === userCollectibles[2].tokenId).order).toBe(null);
        // @ts-ignore
        expect(result.find(collectible => collectible.tokenId === otherCollectibles[0].tokenId).order).toBe(order3);
        expect(mockedSource.fetchCollectiblesAsync).toBeCalledWith([otherCollectibles[0].tokenId]);
    });

    it('There are 21 orders to sale from other users, that should be fetched in three different chunks', async () => {
        // given
        const collectibleAddr = addressFactory.build().address;
        const userCollectibles = collectibleFactory.buildList(3);
        const otherCollectibles = collectibleFactory.buildList(21);
        const mockedAdd = addressFactory.build().address;
        mockedSource.fetchAllUserCollectiblesAsync.mockResolvedValue(userCollectibles);
        mockedSource.fetchCollectiblesAsync.mockResolvedValue(otherCollectibles);
        const order1 = {
            makerAssetData: assetDataUtils.encodeERC721AssetData(
                collectibleAddr,
                new BigNumber(userCollectibles[0].tokenId),
            ),
        };
        const order2 = {
            makerAssetData: assetDataUtils.encodeERC721AssetData(
                collectibleAddr,
                new BigNumber(userCollectibles[1].tokenId),
            ),
        };
        const collectibleOrders = [order1, order2];
        for (let otherOrdersIterator = 0; otherOrdersIterator < 21; otherOrdersIterator++) {
            const newOtherUserOrder = {
                makerAssetData: assetDataUtils.encodeERC721AssetData(
                    collectibleAddr,
                    new BigNumber(otherCollectibles[otherOrdersIterator].tokenId),
                ),
            };
            collectibleOrders.push(newOtherUserOrder);
        }
        mockedRelayer.getSellCollectibleOrdersAsync.mockResolvedValue(collectibleOrders);
        const gateway = new CollectiblesMetadataGateway(mockedRelayer, mockedSource);
        // when
        await gateway.fetchAllCollectibles(mockedAdd);
        // then
        expect(mockedSource.fetchCollectiblesAsync).toBeCalledTimes(3);
    });

    it('User does not have collectibles, other user do not have collectibles for sale', async () => {
        // given
        const mockedAdd = addressFactory.build().address;
        mockedSource.fetchAllUserCollectiblesAsync.mockResolvedValue([]);
        mockedRelayer.getSellCollectibleOrdersAsync.mockResolvedValue([]);
        const gateway = new CollectiblesMetadataGateway(mockedRelayer, mockedSource);

        // when
        const result = await gateway.fetchAllCollectibles(mockedAdd);

        // then
        expect(result).toHaveLength(0);
        expect(mockedSource.fetchCollectiblesAsync).not.toBeCalled();
    });

    it('User does not have collectibles, other users have some collectibles for sale', async () => {
        // given
        const mockedAdd = addressFactory.build().address;
        const collectibleAddr = addressFactory.build().address;
        const otherCollectibles = collectibleFactory.buildList(2);
        mockedSource.fetchAllUserCollectiblesAsync.mockResolvedValue([]);
        mockedSource.fetchCollectiblesAsync.mockResolvedValue(otherCollectibles);
        mockedRelayer.getSellCollectibleOrdersAsync.mockResolvedValue([]);
        const order1 = {
            makerAssetData: assetDataUtils.encodeERC721AssetData(
                collectibleAddr,
                new BigNumber(otherCollectibles[0].tokenId),
            ),
        };
        const order2 = {
            makerAssetData: assetDataUtils.encodeERC721AssetData(
                collectibleAddr,
                new BigNumber(otherCollectibles[1].tokenId),
            ),
        };
        mockedRelayer.getSellCollectibleOrdersAsync.mockResolvedValue([order1, order2]);
        const gateway = new CollectiblesMetadataGateway(mockedRelayer, mockedSource);

        // when
        const result = await gateway.fetchAllCollectibles(mockedAdd);

        // then
        expect(result).toHaveLength(2);
        expect(mockedSource.fetchCollectiblesAsync).toBeCalledTimes(1);
    });
});
