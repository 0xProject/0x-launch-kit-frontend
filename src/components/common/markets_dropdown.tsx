import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { changeMarket, getOrderbookAndUserOrders } from '../../store/actions';
import { getBaseToken, getCurrencyPair, getMarkets } from '../../store/selectors';
import { getColorBySymbol } from '../../util/known_tokens';
import { themeColors, themeDimensions } from '../../util/theme';
import { CurrencyPair, Market, StoreState, Token } from '../../util/types';

import { CardBase } from './card_base';
import { Dropdown } from './dropdown';
import { ChevronDownIcon } from './icons/chevron_down_icon';
import { MagnifierIcon } from './icons/magnifier_icon';
import { TokenIcon } from './icons/token_icon';
import { CustomTDFirst, CustomTDLast, Table, TBody, THead, THFirst, THLast, TR } from './table';

interface PropsDivElement extends HTMLAttributes<HTMLDivElement> {}

interface DispatchProps {
    getOrderbookAndUserOrders: () => any;
    changeMarket: (currencyPair: CurrencyPair) => any;
}

interface PropsToken {
    baseToken: Token | null;
    currencyPair: CurrencyPair;
    markets: Market[] | null;
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

const THFirstStyled = styled(THFirst)`
    ${verticalCellPadding};
`;

const THLastStyled = styled(THLast)`
    ${verticalCellPadding};
`;

const CustomTDFirstStyled = styled(CustomTDFirst)`
    font-weight: 700;

    ${verticalCellPadding};
`;

const CustomTDLastStyled = styled(CustomTDLast)`
    ${verticalCellPadding};
`;

const FILTER_TOKENS = ['All', 'ETH', 'DAI', 'USDC'];

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
        const { baseToken, currencyPair, markets } = this.props;
        const { search } = this.state;

        if (!baseToken || !markets) {
            return null;
        }

        const filteredMarkets = markets.filter(market => {
            const baseLowerCase = market.currencyPair.base.toLowerCase();
            const quoteLowerCase = market.currencyPair.quote.toLowerCase();
            return `${baseLowerCase}/${quoteLowerCase}`.indexOf(search.toLowerCase()) !== -1;
        });

        return (
            <Table>
                <THead>
                    <TR>
                        <THFirstStyled styles={{ textAlign: 'left' }}>Market</THFirstStyled>
                        <THLastStyled styles={{ textAlign: 'center' }}>Price (USD)</THLastStyled>
                    </TR>
                </THead>
                <TBody>
                    {filteredMarkets.map((market, index) => {
                        const isActive =
                            market.currencyPair.base === currencyPair.base &&
                            market.currencyPair.quote === currencyPair.quote;
                        const setSelectedMarket = () => this._setSelectedMarket(market.currencyPair);

                        const primaryColor = getColorBySymbol(market.currencyPair.base);

                        return (
                            <TRStyled active={isActive} key={index} onClick={setSelectedMarket}>
                                <CustomTDFirstStyled styles={{ textAlign: 'left', borderBottom: true }}>
                                    <TokenIcon symbol={market.currencyPair.base} primaryColor={primaryColor} />
                                    <span>
                                        {market.currencyPair.base.toUpperCase()}/
                                        {market.currencyPair.quote.toUpperCase()}
                                    </span>
                                </CustomTDFirstStyled>
                                <CustomTDLastStyled styles={{ textAlign: 'center', borderBottom: true }}>
                                    {this._getPrice(market)}
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

    private readonly _getPrice: any = (market: Market) => {
        if (market.price) {
            return market.price.toFixed(2); // fvtodo use proper constant
        }

        return '-';
    };
}

const mapStateToProps = (state: StoreState): PropsToken => {
    return {
        baseToken: getBaseToken(state),
        currencyPair: getCurrencyPair(state),
        markets: getMarkets(state),
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
