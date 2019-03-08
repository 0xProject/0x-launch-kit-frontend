import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { setSelectedToken, updateOrders } from '../../store/actions';
import { getSelectedToken, getTokens } from '../../store/selectors';
import { themeColors, themeDimensions } from '../../util/theme';
import { StoreState, Token } from '../../util/types';

import { CardBase } from './card_base';
import { Dropdown } from './dropdown';
import { ChevronDownIcon } from './icons/chevron_down_icon';
import { MagnifierIcon } from './icons/magnifier_icon';
import { TokenIcon } from './icons/token_icon';
import { Loading } from './loading';
import { CustomTD, CustomTDFirst, CustomTDLast, Table, TBody, TH, THead, THFirst, THLast, TR } from './table';

interface PropsDivElement extends HTMLAttributes<HTMLDivElement> {}

interface DispatchProps {
    setSelectedToken: (token: Token) => Promise<any>;
    updateOrders: () => any;
}

interface PropsToken {
    tokens: Token[];
    selectedToken: Token | null;
}

type Props = PropsDivElement & PropsToken & DispatchProps;

interface State {
    isLoadingMarkets: boolean;
    selectedFilter: number;
    filteredTokens: Token[];
    alreadyAssignedProps: boolean;
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
        // Note: this will give you a headache in the long run, so please use redux / mobx or something...
        isLoadingMarkets: true,
        selectedFilter: 0,
        filteredTokens: [],
        alreadyAssignedProps: false,
        search: '',
    };

    private _closeDropdown: any;

    public static getDerivedStateFromProps(nextProps: Props, previousState: State): any {
        // Check for initialization
        if (!previousState.alreadyAssignedProps && nextProps.tokens && nextProps.tokens.length > 0) {
            previousState.filteredTokens = nextProps.tokens;
            previousState.alreadyAssignedProps = true;
            return previousState;
        }
        return null;
    }

    public render = () => {
        const { selectedToken, ...restProps } = this.props;

        const tokenName = (selectedToken && selectedToken.name) || '';

        const header = (
            <MarketsDropdownHeader>
                <MarketsDropdownHeaderText>
                    {selectedToken ? <TokenIcon token={selectedToken} /> : ''}
                    {tokenName}
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

        return (
            <MarketsDropdownWrapper
                body={body}
                header={header}
                onClick={this._loadMarkets}
                ref={this._setRef}
                {...restProps}
            />
        );
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

    private readonly _loadMarkets = () => {
        // This is only for showing the 'loading' component, delete ASAP
        setTimeout(() => {
            this.setState({ isLoadingMarkets: false });
        }, 2000);
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
        const value = search.toLowerCase();
        const filteredTokens = this.props.tokens.filter((token: Token) => {
            const symbol = token.symbol.toLowerCase();
            return symbol.indexOf(value) !== -1;
        });

        this.setState({
            filteredTokens,
            search,
        });
    };

    private readonly _getMarkets = () => {
        const { selectedToken } = this.props;

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
                    {this.state.filteredTokens.map((token, index) => {
                        const { symbol } = token;
                        let isActive = false;
                        if (selectedToken) {
                            isActive = symbol === selectedToken.symbol;
                        }
                        return (
                            <TRStyled
                                active={isActive}
                                key={symbol}
                                onClick={this._setSelectedMarket.bind(this, token)}
                            >
                                <CustomTDFirstStyled styles={{ textAlign: 'left', borderBottom: true }}>
                                    <TokenIcon token={token} />
                                    {symbol.toUpperCase()}
                                </CustomTDFirstStyled>
                                <CustomTDStyled styles={{ textAlign: 'right', borderBottom: true }}>
                                    {this._getPrice(token)}
                                </CustomTDStyled>
                                <CustomTDStyled styles={{ textAlign: 'center', borderBottom: true }}>
                                    {this._getDayChange(token)}
                                </CustomTDStyled>
                                <CustomTDLastStyled styles={{ textAlign: 'right', borderBottom: true }}>
                                    {this._getDayVolumen(token)}
                                </CustomTDLastStyled>
                            </TRStyled>
                        );
                    })}
                </TBody>
            </Table>
        );
    };

    private readonly _setSelectedMarket: any = async (token: Token) => {
        await this.props.setSelectedToken(token);
        this.props.updateOrders();
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
        tokens: getTokens(state),
        selectedToken: getSelectedToken(state),
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setSelectedToken: (token: Token) => dispatch(setSelectedToken(token)),
        updateOrders: () => dispatch(updateOrders()),
    };
};

const MarketsDropdownContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MarketsDropdown);

export { MarketsDropdown, MarketsDropdownContainer };
