import { BigNumber } from '0x.js';
import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { MAKER_FEE, ZRX_TOKEN_SYMBOL } from '../../common/constants';
import { getZeroXPriceInUSD, getZeroXPriceInWeth } from '../../util/market_prices';
import { themeColors, themeDimensions } from '../../util/theme';
import { tokenAmountInUnits, tokenAmountInUnitsToBigNumber } from '../../util/tokens';
import { MarketPrice, Token } from '../../util/types';
import { CardTabSelector } from '../common/card_tab_selector';

interface Props extends HTMLAttributes<HTMLButtonElement> {}

enum OrderType {
    Limit,
    Market,
}

interface State {
    limitOrder: {
        orderDetailType: OrderDetailsType;
        zeroXFeeInUSD: BigNumber;
        zeroXFeeInWeth: BigNumber;
        totalCostInWeth: BigNumber;
        totalCostInUSD: BigNumber;
    };
    marketOrder: {};
}

interface Props {
    orderType: OrderType;
    tokenAmount: BigNumber;
    tokenPrice: BigNumber;
    baseToken: Token | null;
    marketPriceEther: MarketPrice | null;
}

const Row = styled.div`
    align-items: center;
    border-bottom: solid 1px ${themeColors.borderColor};
    display: flex;
    justify-content: space-between;
    padding: 15px ${themeDimensions.horizontalPadding};
    position: relative;
    z-index: 1;

    &:first-child {
        padding-top: 5px;
    }

    &:last-child {
        border-bottom: none;
        padding-bottom: 5px;
    }
`;

const Value = styled.div`
    color: #000;
    flex-shrink: 0;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
    white-space: nowrap;
`;

const LabelContainer = styled.div`
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const Label = styled.label<{ color?: string }>`
    color: ${props => props.color || '#000'};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
`;

const InnerTabs = styled(CardTabSelector)`
    font-size: 14px;
`;

enum OrderDetailsType {
    Eth,
    Usd,
}

class OrderDetails extends React.Component<Props, State> {
    // TODO: Refactor with hooks (needs react version update)

    public state = {
        limitOrder: {
            orderDetailType: OrderDetailsType.Eth,
            zeroXFeeInUSD: new BigNumber(0),
            zeroXFeeInWeth: new BigNumber(0),
            totalCostInWeth: new BigNumber(0),
            totalCostInUSD: new BigNumber(0),
        },
        marketOrder: {
            orderDetailType: OrderDetailsType.Eth,
            zeroXFeeInUSD: new BigNumber(0),
            zeroXFeeInWeth: new BigNumber(0),
            totalCostInWeth: new BigNumber(0),
            totalCostInUSD: new BigNumber(0),
        },
    };

    public updateLimitOrderState = async () => {
        const { tokenAmount, tokenPrice, baseToken, marketPriceEther } = this.props;
        if (baseToken && marketPriceEther) {
            /* Reduces decimals of the token amount */
            const tokenAmountConverted = tokenAmountInUnitsToBigNumber(tokenAmount, baseToken.decimals);
            /* This could be refactored with promise all  */
            const promisesArray = [getZeroXPriceInWeth(), getZeroXPriceInUSD()];

            const results = await Promise.all(promisesArray);
            const [zeroXPriceInWeth, zeroXPriceInUSD] = results;
            const ethInUSD = marketPriceEther.priceUSD;
            /* Calculates total cost in wETH */
            const zeroXFeeInWeth = zeroXPriceInWeth.mul(tokenAmountInUnits(MAKER_FEE, 18));
            const totalPriceWithoutFeeInWeth = tokenAmountConverted.mul(tokenPrice);
            const totalCostInWeth = totalPriceWithoutFeeInWeth.add(zeroXFeeInWeth);

            /* Calculates total cost in USD */
            const zeroXFeeInUSD = zeroXPriceInUSD.mul(tokenAmountInUnits(MAKER_FEE, 18));
            const totalPriceWithoutFeeInUSD = totalPriceWithoutFeeInWeth.mul(ethInUSD);
            const totalCostInUSD = totalPriceWithoutFeeInUSD.add(zeroXFeeInUSD);

            this.setState({
                limitOrder: {
                    ...this.state.limitOrder,
                    zeroXFeeInWeth,
                    zeroXFeeInUSD,
                    totalCostInWeth,
                    totalCostInUSD,
                },
            });
        }
    };

    public updateMarketOrderState = async () => {
        /* TODO */
        const { tokenAmount, tokenPrice } = this.props;
        await this._calculateTotalCostMarketInWeth(tokenAmount, tokenPrice);
        return null;
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) => {
        const newProps = this.props;
        if (
            newProps.tokenPrice !== prevProps.tokenPrice ||
            newProps.orderType !== prevProps.orderType ||
            newProps.tokenAmount !== prevProps.tokenAmount ||
            newProps.baseToken !== prevProps.baseToken ||
            newProps.marketPriceEther !== prevProps.marketPriceEther
        ) {
            if (newProps.orderType === OrderType.Limit) {
                await this.updateLimitOrderState();
            }
            if (newProps.orderType === OrderType.Market) {
                await this.updateMarketOrderState();
            }
        }
    };

    public componentDidMount = async () => {
        const { orderType } = this.props;
        if (orderType === OrderType.Limit) {
            await this.updateLimitOrderState();
        }
        if (orderType === OrderType.Market) {
            await this.updateMarketOrderState();
        }
    };

    public render = () => {
        const { orderType } = this.props;
        let orderDetailType = OrderDetailsType.Eth;
        let zeroXFeeInUSD = new BigNumber(0);
        let totalCostInWeth = new BigNumber(0);
        let totalCostInUSD = new BigNumber(0);
        if (orderType === OrderType.Limit) {
            ({ orderDetailType, zeroXFeeInUSD, totalCostInWeth, totalCostInUSD } = this.state.limitOrder);
        }
        if (orderType === OrderType.Market) {
            ({ orderDetailType, zeroXFeeInUSD, totalCostInWeth, totalCostInUSD } = this.state.marketOrder);
        }
        return this._renderOrderDetails(orderDetailType, zeroXFeeInUSD, totalCostInWeth, totalCostInUSD);
    };

    private readonly _calculateTotalCostMarketInWeth = async (
        tokenAmount: BigNumber,
        tokenPrice: BigNumber,
    ): Promise<BigNumber> => {
        const totalCost = new BigNumber(0);
        /* TODO **/
        return totalCost;
    };

    private readonly _renderOrderDetails = (
        orderDetailType: OrderDetailsType,
        zeroXFeeInUSD: BigNumber,
        totalCostInWeth: BigNumber,
        totalCostInUSD: BigNumber,
    ) => {
        const ethUsdTabs = [
            {
                active: orderDetailType === OrderDetailsType.Eth,
                onClick: this._switchToEth,
                text: ZRX_TOKEN_SYMBOL.toUpperCase(),
            },
            {
                active: orderDetailType === OrderDetailsType.Usd,
                onClick: this._switchToUsd,
                text: 'USD',
            },
        ];
        return (
            <>
                <LabelContainer>
                    <Label>Order Details</Label>
                    <InnerTabs tabs={ethUsdTabs} />
                </LabelContainer>
                <Row>
                    <Label color={themeColors.textLight}>Fee</Label>
                    <Value />
                    <Value>
                        {orderDetailType === OrderDetailsType.Usd
                            ? `$ ${zeroXFeeInUSD.toFixed(2)}`
                            : `${tokenAmountInUnits(MAKER_FEE, 18, 2)} ZRX`}
                    </Value>
                </Row>
                <LabelContainer>
                    <Label>Total Cost</Label>
                    <Value>
                        ({totalCostInWeth.toFixed(2)} wETH) {`$ ${totalCostInUSD.toFixed(2)}`}
                    </Value>
                </LabelContainer>
            </>
        );
    };

    private readonly _switchToUsd = () => {
        const { orderType } = this.props;
        if (orderType === OrderType.Market) {
            this.setState({
                marketOrder: {
                    ...this.state.marketOrder,
                    orderDetailType: OrderDetailsType.Usd,
                },
            });
        }
        if (orderType === OrderType.Limit) {
            this.setState({
                limitOrder: {
                    ...this.state.limitOrder,
                    orderDetailType: OrderDetailsType.Usd,
                },
            });
        }
    };

    private readonly _switchToEth = () => {
        const { orderType } = this.props;
        if (orderType === OrderType.Market) {
            this.setState({
                marketOrder: {
                    ...this.state.marketOrder,
                    orderDetailType: OrderDetailsType.Eth,
                },
            });
        }
        if (orderType === OrderType.Limit) {
            this.setState({
                limitOrder: {
                    ...this.state.limitOrder,
                    orderDetailType: OrderDetailsType.Eth,
                },
            });
        }
    };
}

export { OrderDetails };
