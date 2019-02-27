import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeColors } from '../../util/theme';

import { Loading } from './loading';

interface Props extends HTMLAttributes<HTMLDivElement> {}

interface State {
    isLoading: boolean;
}

const PriceChangeWrapper = styled.div`
    align-items: center;
    display: flex;
    min-height: 33px;
    min-width: 100px;
    position: relative;
`;

const ValueLabelWrapper = styled.div`
    align-items: center;
    display: flex;
    margin: 0 20px 0 0;

    &:last-child {
        margin-right: 0;
    }
`;

const Value = styled.h3`
    color: #000;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    line-height: normal;
    margin: 0 7px 0 0;
`;

const Label = styled.p`
    color: ${themeColors.lightGray};
    font-size: 14px;
    font-weight: normal;
    line-height: 1.2;
    margin: 0;
`;

const DayChange = styled.span<{ status?: string }>`
    ${props => (props.status === 'less' ? `color: ${themeColors.orange};` : '')}
    ${props => (props.status === 'more' ? `color: ${themeColors.green};` : '')}
`;

const LoadingStyled = styled(Loading)`
    left: 50%;
    min-height: 0;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
`;

const LAST_TRADE_PRICE = '.00238 ETH';
const VARIATION = {
    previousDay: '50',
    currentDay: (Math.random() * 100).toString(),
};

export class PriceChange extends React.Component<Props, State> {
    public readonly state: State = {
        isLoading: true,
    };

    public render = () => {
        return (
            <PriceChangeWrapper>
                {this.state.isLoading ? (
                    <LoadingStyled />
                ) : (
                    <>
                        <ValueLabelWrapper>
                            <Value>{LAST_TRADE_PRICE}</Value>
                            <Label>last trade price</Label>
                        </ValueLabelWrapper>
                        <ValueLabelWrapper>
                            <Value>{this._getDayChange(VARIATION)}</Value>
                            <Label>24hr change</Label>
                        </ValueLabelWrapper>
                    </>
                )}
            </PriceChangeWrapper>
        );
    };

    public componentDidMount = () => {
        this._loadValues();
    };

    private readonly _loadValues = () => {
        // This is only for showing the 'loading' component, delete ASAP
        setTimeout(() => {
            this.setState({ isLoading: false });
        }, 2500);
    };

    private readonly _getDayChange: any = (item: any) => {
        const previousDay: number = parseFloat(item.previousDay);
        const currentDay: number = parseFloat(item.currentDay);
        const percentChange: string = (((currentDay - previousDay) / previousDay) * 100).toFixed(2);

        if (currentDay > previousDay) {
            return <DayChange status={'more'}>+{percentChange}%</DayChange>;
        } else if (currentDay < previousDay) {
            return <DayChange status={'less'}>{percentChange}%</DayChange>;
        }

        return <DayChange>{percentChange}%</DayChange>;
    };
}
