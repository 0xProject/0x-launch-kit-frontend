import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeColors, themeDimensions } from '../../util/theme';
import { CustomTD, CustomTDFirst, CustomTDLast, Table, TBody, TH, THead, THFirst, THLast, TR } from '../common/table';

import { CardBase } from './card_base';
import { Dropdown } from './dropdown';
import { ChevronDownIcon } from './icons/chevron_down_icon';
import { MagnifierIcon } from './icons/magnifier_icon';
import { Loading } from './loading';

interface Props extends HTMLAttributes<HTMLDivElement> {}

interface State {
    isLoadingMarkets: boolean;
    selectedFilter: number;
    selectedMarketItem: number;
}

interface TokenFiltersTabProps {
    active: boolean;
    onClick: number;
}

interface MarketRowProps {
    active: boolean;
}

const rowHeight = '48px';

const MarketsDropdownWrapper = styled(Dropdown)``;

const MarketsDropdownHeader = styled.div`
    align-items: center;
    display: flex;
`;

const MarketsDropdownHeaderText = styled.span`
    color: #000;
    font-size: 18px;
    font-weight: 600;
    line-height: normal;
    margin-right: 10px;
`;

const MarketsDropdownBody = styled(CardBase)`
    max-height: 100%;
    max-width: 100%;
    width: 565px;
`;

const MarketsFilters = styled.div`
    align-items: center;
    border-bottom: 1px solid ${themeColors.borderColor};
    display: flex;
    justify-content: space-between;
    min-height: ${rowHeight};
    padding: 8px 8px 8px ${themeDimensions.horizontalPadding};
`;

const MarketsFiltersLabel = styled.h2`
    color: #000;
    font-size: 16px;
    font-weight: 600;
    line-height: normal;
    margin: 0 auto 0 0;
`;

const TokenFiltersTabs = styled.div`
    align-items: center;
    display: flex;
    margin-right: 20px;
`;

const TokenFiltersTab = styled.span<TokenFiltersTabProps>`
    color: ${props => (props.active ? '#000' : themeColors.lightGray)};
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;

    &:after {
        color: ${themeColors.lightGray};
        content: '/';
        margin: 0 6px;
    }

    &:last-child:after {
        display: none;
    }
`;

const searchFieldHeight = '32px';
const searchFieldWidth = '179px';

const SearchWrapper = styled.div`
    height: ${searchFieldHeight};
    position: relative;
    width: ${searchFieldWidth};
`;

const SearchField = styled.input`
    background: #eaeaea;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${themeColors.borderColor};
    color: #333;
    font-size: 13px;
    height: ${searchFieldHeight};
    left: 0;
    padding: 0 15px 0 30px;
    position: absolute;
    top: 0;
    width: ${searchFieldWidth};
    z-index: 1;
`;

const MagnifierIconWrapper = styled.div`
    height: 18px;
    left: 12px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    z-index: 12;
`;

const TableWrapper = styled.div`
    height: 420px;
    overflow: auto;
    position: relative;
`;

const verticalCellPadding = `
    padding-bottom: 10px;
    padding-top: 10px;
`;

const TRStyled = styled(TR)<MarketRowProps>`
    background-color: ${props => (props.active ? themeColors.rowActive : 'transparent')};
    cursor: ${props => (props.active ? 'default' : 'pointer')};

    &:hover {
        background-color: ${themeColors.rowActive};
    }
`;

const THStyled = styled(TH)`
    ${verticalCellPadding};
`;

const THFirstStyled = styled(THFirst)`
    ${verticalCellPadding};
`;

const THLastStyled = styled(THLast)`
    ${verticalCellPadding};
`;

const CustomTDStyled = styled(CustomTD)`
    ${verticalCellPadding};
`;

const CustomTDFirstStyled = styled(CustomTDFirst)`
    font-weight: 700;

    ${verticalCellPadding};
`;

const CustomTDLastStyled = styled(CustomTDLast)`
    ${verticalCellPadding};
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

const FILTER_TOKENS = ['All', 'ETH', 'DAI', 'USDC'];
const MARKETS_LIST = [
    {
        name: 'ZRX / ETH',
        price: '0.25',
        previousDay: '100',
        currentDay: '150',
        dayVol: '515235.00',
    },
    {
        name: 'ABC / ETH',
        price: '0.55',
        previousDay: '90',
        currentDay: '45',
        dayVol: '435345.48',
    },
    {
        name: 'DEF / ETH',
        price: '0.675',
        previousDay: '900',
        currentDay: '900',
        dayVol: '3453463.04',
    },
    {
        name: 'GHI / ETH',
        price: '0.643',
        previousDay: '78',
        currentDay: '90',
        dayVol: '456.23',
    },
    {
        name: 'ZRX / DAI',
        price: '0.978687',
        previousDay: '12',
        currentDay: '26',
        dayVol: '24534.56',
    },
    {
        name: 'ABC / ETH',
        price: '0.755',
        previousDay: '78',
        currentDay: '78',
        dayVol: '515235.05',
    },
    {
        name: 'CDF / ETH',
        price: '0.7547',
        previousDay: '56',
        currentDay: '78',
        dayVol: '515235.00',
    },
    {
        name: 'GHI / ETH',
        price: '0.765',
        previousDay: '90',
        currentDay: '80',
        dayVol: '3948573.34',
    },
    {
        name: 'OMG / ETH',
        price: '0.908',
        previousDay: '55',
        currentDay: '55',
        dayVol: '3455.00',
    },
    {
        name: 'OMG / DAI',
        price: '0.765',
        previousDay: '99',
        currentDay: '101',
        dayVol: '123235.00',
    },
    {
        name: 'ASD / ETH',
        price: '0.543',
        previousDay: '90',
        currentDay: '88',
        dayVol: '1515235.00',
    },
    {
        name: 'ZRX / DAI',
        price: '0.978687',
        previousDay: '12',
        currentDay: '34',
        dayVol: '24534.56',
    },
    {
        name: 'ABC / ETH',
        price: '0.755',
        previousDay: '78',
        currentDay: '98',
        dayVol: '515235.05',
    },
    {
        name: 'CDF / ETH',
        price: '0.7547',
        previousDay: '56',
        currentDay: '78',
        dayVol: '515235.00',
    },
    {
        name: 'GHI / ETH',
        price: '0.765',
        previousDay: '90',
        currentDay: '80',
        dayVol: '3948573.34',
    },
];

export class MarketsDropdown extends React.Component<Props, State> {
    public readonly state: State = {
        isLoadingMarkets: true,
        // Note: this will give you a headache in the long run, so please use redux / mobx or something...
        selectedFilter: 0,
        selectedMarketItem: 0,
    };

    public render = () => {
        const { ...restProps } = this.props;

        const header = (
            <MarketsDropdownHeader>
                <MarketsDropdownHeaderText>
                    {MARKETS_LIST[this.state.selectedMarketItem].name}
                </MarketsDropdownHeaderText>
                <ChevronDownIcon />
            </MarketsDropdownHeader>
        );

        const body = (
            <MarketsDropdownBody>
                <MarketsFilters>
                    <MarketsFiltersLabel>Markets</MarketsFiltersLabel>
                    {this._getTokensFilterTabs()}
                    {this._getSearchField()}
                </MarketsFilters>
                <TableWrapper>{this.state.isLoadingMarkets ? <LoadingStyled /> : this._getMarkets()}</TableWrapper>
            </MarketsDropdownBody>
        );

        return <MarketsDropdownWrapper {...restProps} header={header} body={body} />;
    };

    public componentDidMount = () => {
        setTimeout(() => {
            this.setState({ isLoadingMarkets: false });
        }, 3000);
    };

    private readonly _getTokensFilterTabs = () => {
        return (
            <TokenFiltersTabs>
                {FILTER_TOKENS.map((item, index) => {
                    return (
                        <TokenFiltersTab
                            active={index === this.state.selectedFilter}
                            key={index}
                            onClick={this._setTokensFilterTab.bind(this, index)}
                        >
                            {item}
                        </TokenFiltersTab>
                    );
                })}
            </TokenFiltersTabs>
        );
    };

    private readonly _setTokensFilterTab: any = (index: number) => {
        this.setState({ selectedFilter: index });
    };

    private readonly _getSearchField = () => {
        return (
            <SearchWrapper>
                <MagnifierIconWrapper>{MagnifierIcon()}</MagnifierIconWrapper>
                <SearchField />
            </SearchWrapper>
        );
    };

    private readonly _getMarkets = () => {
        return (
            <Table>
                <THead>
                    <TR>
                        <THFirstStyled styles={{ textAlign: 'left' }}>Market</THFirstStyled>
                        <THStyled styles={{ textAlign: 'center' }}>Price (USD)</THStyled>
                        <THStyled styles={{ textAlign: 'center' }}>24H change</THStyled>
                        <THLastStyled styles={{ textAlign: 'center' }}>24H Vol (usd)</THLastStyled>
                    </TR>
                </THead>
                <TBody>
                    {MARKETS_LIST.map((item, index) => {
                        return (
                            <TRStyled
                                active={index === this.state.selectedMarketItem}
                                key={index}
                                onClick={this._setSelectedMarket.bind(this, index)}
                            >
                                <CustomTDFirstStyled styles={{ textAlign: 'left', borderBottom: true }}>
                                    {item.name}
                                </CustomTDFirstStyled>
                                <CustomTDStyled styles={{ textAlign: 'right', borderBottom: true }}>
                                    {item.price}
                                </CustomTDStyled>
                                <CustomTDStyled styles={{ textAlign: 'center', borderBottom: true }}>
                                    {this._getDayChange(item)}
                                </CustomTDStyled>
                                <CustomTDLastStyled styles={{ textAlign: 'right', borderBottom: true }}>
                                    {item.dayVol}
                                </CustomTDLastStyled>
                            </TRStyled>
                        );
                    })}
                </TBody>
            </Table>
        );
    };

    private readonly _setSelectedMarket: any = (index: number) => {
        this.setState({ selectedMarketItem: index });
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
