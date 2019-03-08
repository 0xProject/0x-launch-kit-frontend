import { BigNumber } from '0x.js';
import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { MAKER_FEE } from '../../common/constants';
import { getZeroXPriceInUSD } from '../../util/market_prices';
import { themeColors, themeDimensions } from '../../util/theme';
import { CardTabSelector } from '../common/card_tab_selector';

interface Props extends HTMLAttributes<HTMLButtonElement> {}

interface State {
    orderDetailType: OrderDetailsType;
    zeroXPriceInUSD: BigNumber;
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
        orderDetailType: OrderDetailsType.Eth,
        zeroXPriceInUSD: new BigNumber(0),
    };

    public componentDidMount = async () => {
        let zeroXPriceInUSD = await getZeroXPriceInUSD();
        zeroXPriceInUSD = zeroXPriceInUSD.mul(MAKER_FEE);
        this.setState({ zeroXPriceInUSD });
    };

    public render = () => {
        const { orderDetailType } = this.state;
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
                            ? `$ ${this.state.zeroXPriceInUSD.toFixed(2)}`
                            : `${MAKER_FEE} ZRX`}
                    </Value>
                </Row>
            </>
        );
    };

    private readonly _switchToUsd = () => {
        this.setState({
            orderDetailType: OrderDetailsType.Usd,
        });
    };

    private readonly _switchToEth = () => {
        this.setState({
            orderDetailType: OrderDetailsType.Eth,
        });
    };
}

export { OrderDetails };
