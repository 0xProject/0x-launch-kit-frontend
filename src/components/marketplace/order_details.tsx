import { BigNumber } from '0x.js';
import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { MAKER_FEE } from '../../common/constants';
import { getEthereumPriceInUSD, getZeroXPriceInUSD, getZeroXPriceInWeth } from '../../util/market_prices';
import { themeColors, themeDimensions } from '../../util/theme';
import { tokenAmountInUnitsToBigNumber } from '../../util/tokens';
import { Token } from '../../util/types';
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
    selectedToken: Token | null;
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
        const { tokenAmount, tokenPrice, selectedToken } = this.props;
        if (selectedToken) {
            /* Reduces decimals of the token amount */
            const tokenAmountConverted = tokenAmountInUnitsToBigNumber(tokenAmount, selectedToken.decimals);
            /* This could be refactored with promise all  */
            const promisesArray = [getZeroXPriceInWeth(), getZeroXPriceInUSD(), getEthereumPriceInUSD()];
            try {
                const results = await Promise.all(promisesArray);
                const [zeroXPriceInWeth, zeroXPriceInUSD, ethInUSD] = results;
                /* Calculates total cost in wETH */
                const zeroXFeeInWeth = zeroXPriceInWeth.mul(MAKER_FEE);
                const totalPriceWithoutFeeInWeth = tokenAmountConverted.mul(tokenPrice);
                const totalCostInWeth = totalPriceWithoutFeeInWeth.add(zeroXFeeInWeth);

                /* Calculates total cost in USD */
                const zeroXFeeInUSD = zeroXPriceInUSD.mul(MAKER_FEE);
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
            } catch (error) {
                throw error;
            }
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
            newProps.selectedToken !== prevProps.selectedToken
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
        let render = null;
        if (orderType === OrderType.Limit) {
            render = this._renderLimitOrder();
        }
        if (orderType === OrderType.Market) {
            render = this._renderMarketOrder();
        }
        return render;
    };

    private readonly _calculateTotalCostMarketInWeth = async (
        tokenAmount: BigNumber,
        tokenPrice: BigNumber,
    ): Promise<BigNumber> => {
        const totalCost = new BigNumber(0);
        /* TODO **/
        return totalCost;
    };

    private readonly _renderLimitOrder = () => {
        const { orderDetailType, zeroXFeeInUSD, totalCostInWeth, totalCostInUSD } = this.state.limitOrder;
        const ethUsdTabs = [
            {
                active: orderDetailType === OrderDetailsType.Eth,
                onClick: this._switchToEth,
                text: 'ZRX',
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
                            : `${MAKER_FEE} ZRX`}
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

    private readonly _renderMarketOrder = () => {
        return null;
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
