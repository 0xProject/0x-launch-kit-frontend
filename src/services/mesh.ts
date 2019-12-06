import { assetDataUtils } from '@0x/order-utils';
import { Orderbook } from '@0x/orderbook';
import { BigNumber, Mesh, OrderEvent, SignedOrder } from 'albrow-mesh-browser-hackathon';

class MeshOrderbook {
    private readonly _mesh: Mesh;

    constructor() {
        this._mesh = new Mesh({
            ethereumRPCURL: 'https://mainnet.infura.io/v3/af2e590be00f463fbfd0b546784065ad',
            ethereumChainID: 1,
            verbosity: 1,
        });

        // This handler will be called whenver there is a critical error.
        this._mesh.onError((err: Error) => {
            // tslint:disable-next-line:no-console
            console.error(err);
        });

        // This handler will be called whenever an order is added, expired,
        // canceled, or filled.
        this._mesh.onOrderEvents((events: OrderEvent[]) => {
            for (const event of events) {
                // tslint:disable-next-line:no-console
                console.log(event);
            }
        });
    }

    public async startAsync(): Promise<void> {
        await this._mesh.startAsync();
    }

    public async getSellCollectibleOrdersAsync(
        collectibleAddress: string,
        wethAddress: string,
    ): Promise<SignedOrder[]> {
        const makerAssetDataPrefix = `0x02571792000000000000000000000000${collectibleAddress.slice(2)}`;
        const orders = await this._mesh.getOrdersByMakerAssetDataAsync(makerAssetDataPrefix);
        const wethTakerAssetData = assetDataUtils.encodeERC20AssetData(wethAddress);
        const filteredOrders = orders.filter(value => value.takerAssetData === wethTakerAssetData);
        // tslint:disable-next-line:no-console
        console.log(`number of orders in Mesh: ${filteredOrders.length}`);
        return filteredOrders;
    }

    public async submitOrderAsync(order: SignedOrder): Promise<void> {
        const result = await this._mesh.addOrdersAsync([order]);
        // tslint:disable-next-line:no-console
        console.log(result);
    }
}

let meshOrderbook: MeshOrderbook;
export async function getMeshOrderbookAsync(): Promise<MeshOrderbook> {
    if (!meshOrderbook) {
        meshOrderbook = new MeshOrderbook();
        await meshOrderbook.startAsync();
    }

    return meshOrderbook;
}
