import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { availableMarkets } from '../../common/markets';
import { changeMarket, getOrderbookAndUserOrders } from '../../store/actions';
import { getBaseToken, getCurrencyPair } from '../../store/selectors';
import { getColorBySymbol } from '../../util/known_tokens';
import { themeColors, themeDimensions } from '../../util/theme';
import { CurrencyPair, StoreState, Token } from '../../util/types';

import { CardBase } from './card_base';
import { Dropdown } from './dropdown';
import { ChevronDownIcon } from './icons/chevron_down_icon';
import { MagnifierIcon } from './icons/magnifier_icon';
import { TokenIcon } from './icons/token_icon';
import { CustomTD, CustomTDFirst, CustomTDLast, Table, TBody, TH, THead, THFirst, THLast, TR } from './table';

interface PropsDivElement extends HTMLAttributes<HTMLDivElement> {}

interface DispatchProps {
    getOrderbookAndUserOrders: () => any;
    changeMarket: (currencyPair: CurrencyPair) => any;
}

interface PropsToken {
    baseToken: Token | null;
    currencyPair: CurrencyPair;
}

type Props = PropsDivElement & PropsToken & DispatchProps;

interface State {
    selectedFilter: number;
    search: string;
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
    outline: none;
    padding: 0 15px 0 30px;
    position: absolute;
    top: 0;
    width: ${searchFieldWidth};
    z-index: 1;

    &:focus {
        border-color: #aaa;
    }
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
    max-height: 420px;
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
    ${verticalCellPadding};
`;

const CustomTDLastStyled = styled(CustomTDLast)`
    ${verticalCellPadding};
`;

const TokenIconAndLabel = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-start;
`;

const TokenLabel = styled.div`
    color: #000;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 0 15px;
`;

const DayChange = styled.span<{ status?: string }>`
    ${props => (props.status === 'less' ? `color: ${themeColors.orange};` : '')}
    ${props => (props.status === 'more' ? `color: ${themeColors.green};` : '')}
`;

const FILTER_TOKENS = ['All', 'ETH', 'DAI', 'USDC'];
const MARKETS_LIST = [
    {
        name: 'ZRX / ETH',
        symbol: 'zrx',
        price: '0.25',
        previousDay: '100',
        currentDay: '150',
        dayVol: '515235.00',
    },
    {
        name: 'ABC / ETH',
        symbol: 'mkr',
        price: '0.55',
        previousDay: '90',
        currentDay: '45',
        dayVol: '435345.48',
    },
    {
        name: 'DEF / ETH',
        symbol: 'rep',
        price: '0.675',
        previousDay: '900',
        currentDay: '900',
        dayVol: '3453463.04',
    },
    {
        name: 'GHI / ETH',
        symbol: 'dgd',
        price: '0.643',
        previousDay: '78',
        currentDay: '90',
        dayVol: '456.23',
    },
    {
        name: 'ZRX / DAI',
        symbol: 'mln',
        price: '0.978687',
        previousDay: '12',
        currentDay: '26',
        dayVol: '24534.56',
    },
];

class MarketsDropdown extends React.Component<Props, State> {
    public readonly state: State = {
        selectedFilter: 0,
        search: '',
    };

    private _closeDropdown: any;

    public render = () => {
        const { currencyPair, ...restProps } = this.props;

        const header = (
            <MarketsDropdownHeader>
                <MarketsDropdownHeaderText>
                    {currencyPair.base.toUpperCase()}/{currencyPair.quote.toUpperCase()}
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
                <TableWrapper>{this._getMarkets()}</TableWrapper>
            </MarketsDropdownBody>
        );

        return <MarketsDropdownWrapper body={body} header={header} ref={this._setRef} {...restProps} />;
    };

    private readonly _setRef = (node: any) => {
        this._closeDropdown = node.closeDropdown;
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
                <SearchField onChange={this._handleChange} value={this.state.search} />
            </SearchWrapper>
        );
    };

    private readonly _handleChange = (e: any) => {
        const search = e.currentTarget.value;

        this.setState({
            search,
        });
    };

    private readonly _getMarkets = () => {
        const { baseToken, currencyPair } = this.props;
        const { search } = this.state;

        if (!baseToken) {
            return null;
        }

        const filteredMarkets = availableMarkets.filter(cp => {
            const baseLowerCase = cp.base.toLowerCase();
            const quoteLowerCase = cp.quote.toLowerCase();
            return `${baseLowerCase}/${quoteLowerCase}`.indexOf(search.toLowerCase()) !== -1;
        });

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
                    {filteredMarkets.map((cp, index) => {
                        const isActive = cp.base === currencyPair.base && cp.quote === currencyPair.quote;
                        const setSelectedMarket = () => this._setSelectedMarket(cp);

                        const primaryColor = getColorBySymbol(cp.base);

                        return (
                            <TRStyled active={isActive} key={index} onClick={setSelectedMarket}>
                                <CustomTDFirstStyled styles={{ textAlign: 'left', borderBottom: true }}>
                                    <TokenIconAndLabel>
                                        <TokenIcon symbol={cp.base} primaryColor={primaryColor} />
                                        <TokenLabel>
                                            {cp.base.toUpperCase()} / {cp.quote.toUpperCase()}
                                        </TokenLabel>
                                    </TokenIconAndLabel>
                                </CustomTDFirstStyled>
                                <CustomTDStyled styles={{ textAlign: 'right', borderBottom: true }}>
                                    {this._getPrice(baseToken)}
                                </CustomTDStyled>
                                <CustomTDStyled styles={{ textAlign: 'center', borderBottom: true }}>
                                    {this._getDayChange(baseToken)}
                                </CustomTDStyled>
                                <CustomTDLastStyled styles={{ textAlign: 'right', borderBottom: true }}>
                                    {this._getDayVolumen(baseToken)}
                                </CustomTDLastStyled>
                            </TRStyled>
                        );
                    })}
                </TBody>
            </Table>
        );
    };

    private readonly _setSelectedMarket: any = async (currencyPair: CurrencyPair) => {
        await this.props.changeMarket(currencyPair);
        this.props.getOrderbookAndUserOrders();
        this._closeDropdown();
    };

    private readonly _getDayChange: any = (item: Token) => {
        const tokenDummy = MARKETS_LIST.find(obj => {
            return obj.symbol === item.symbol;
        });

        if (!tokenDummy) {
            return <DayChange />;
        }

        const previousDay: number = parseFloat(tokenDummy.previousDay);
        const currentDay: number = parseFloat(tokenDummy.currentDay);
        const percentChange: string = (((currentDay - previousDay) / previousDay) * 100).toFixed(2);

        if (currentDay > previousDay) {
            return <DayChange status={'more'}>+{percentChange}%</DayChange>;
        } else if (currentDay < previousDay) {
            return <DayChange status={'less'}>{percentChange}%</DayChange>;
        }

        return <DayChange>{percentChange}%</DayChange>;
    };

    private readonly _getDayVolumen: any = (item: Token) => {
        const tokenDummy = MARKETS_LIST.find(obj => {
            return obj.symbol === item.symbol;
        });
        return tokenDummy ? tokenDummy.dayVol : '';
    };

    private readonly _getPrice: any = (item: Token) => {
        const tokenDummy = MARKETS_LIST.find(obj => {
            return obj.symbol === item.symbol;
        });
        return tokenDummy ? tokenDummy.price : '';
    };
}

const mapStateToProps = (state: StoreState): PropsToken => {
    return {
        baseToken: getBaseToken(state),
        currencyPair: getCurrencyPair(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        getOrderbookAndUserOrders: () => dispatch(getOrderbookAndUserOrders()),
        changeMarket: (currencyPair: CurrencyPair) => dispatch(changeMarket(currencyPair)),
    };
};

const MarketsDropdownContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MarketsDropdown);

export { MarketsDropdown, MarketsDropdownContainer };
