import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { UI_DECIMALS_DISPLAYED_PRICE_ETH } from '../../../common/constants';
import { marketFilters } from '../../../common/markets';
import { changeMarket, goToHome } from '../../../store/actions';
import { getBaseToken, getCurrencyPair, getMarkets } from '../../../store/selectors';
import { themeDimensions } from '../../../themes/commons';
import { getKnownTokens } from '../../../util/known_tokens';
import { filterMarketsByString, filterMarketsByTokenSymbol } from '../../../util/markets';
import { CurrencyPair, Filter, Market, StoreState, Token } from '../../../util/types';
import { CardBase } from '../../common/card_base';
import { Dropdown } from '../../common/dropdown';
import { ChevronDownIcon } from '../../common/icons/chevron_down_icon';
import { MagnifierIcon } from '../../common/icons/magnifier_icon';
import { TokenIcon } from '../../common/icons/token_icon';
import { CustomTDFirst, CustomTDLast, Table, TBody, THead, THFirst, THLast, TR } from '../../common/table';

interface PropsDivElement extends HTMLAttributes<HTMLDivElement> {}

interface DispatchProps {
    changeMarket: (currencyPair: CurrencyPair) => any;
    goToHome: () => any;
}

interface PropsToken {
    baseToken: Token | null;
    currencyPair: CurrencyPair;
    markets: Market[] | null;
}

type Props = PropsDivElement & PropsToken & DispatchProps;

interface State {
    selectedFilter: Filter;
    search: string;
    isUserOnDropdown: boolean;
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
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 18px;
    font-weight: 600;
    line-height: 26px;
    margin-right: 10px;
`;

const MarketsDropdownBody = styled(CardBase)`
    box-shadow: ${props => props.theme.componentsTheme.boxShadow};
    max-height: 100%;
    max-width: 100%;
    width: 401px;
`;

const MarketsFilters = styled.div`
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.componentsTheme.dropdownBorderColor};
    display: flex;
    justify-content: space-between;
    min-height: ${rowHeight};
    padding: 8px 8px 8px ${themeDimensions.horizontalPadding};
`;

const MarketsFiltersLabel = styled.h2`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 16px;
    font-weight: 600;
    line-height: normal;
    margin: 0 auto 0 0;
`;

const TokenFiltersTabs = styled.div`
    align-items: center;
    display: flex;
    margin-right: 10px;
`;

const TokenFiltersTab = styled.span<TokenFiltersTabProps>`
    color: ${props =>
        props.active ? props.theme.componentsTheme.textColorCommon : props.theme.componentsTheme.lightGray};
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    user-select: none;

    &:after {
        color: ${props => props.theme.componentsTheme.lightGray};
        content: '/';
        margin: 0 6px;
    }

    &:last-child:after {
        display: none;
    }
`;

const searchFieldHeight = '32px';
const searchFieldWidth = '142px';

const SearchWrapper = styled.div`
    height: ${searchFieldHeight};
    position: relative;
    width: ${searchFieldWidth};
`;

const SearchField = styled.input`
    background: ${props => props.theme.componentsTheme.marketsSearchFieldBackgroundColor};
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.marketsSearchFieldBorderColor};
    color: ${props => props.theme.componentsTheme.marketsSearchFieldTextColor};
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
        border-color: ${props => props.theme.componentsTheme.marketsSearchFieldBorderColor};
    }
`;

const MagnifierIconWrapper = styled.div`
    line-height: 30px;
    height: 100%;
    left: 11px;
    position: absolute;
    top: 0;
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

const tableHeaderFontWeight = `
    font-weight: 700;
`;

const TRStyled = styled(TR)<MarketRowProps>`
    background-color: ${props => (props.active ? props.theme.componentsTheme.rowActive : 'transparent')};
    cursor: ${props => (props.active ? 'default' : 'pointer')};

    &:hover {
        background-color: ${props => props.theme.componentsTheme.rowActive};
    }

    &:last-child > td {
        border-bottom-left-radius: ${themeDimensions.borderRadius};
        border-bottom-right-radius: ${themeDimensions.borderRadius};
        border-bottom: none;
    }
`;

// Has a special left-padding: needs a specific selector to override the theme
const THFirstStyled = styled(THFirst)`
    ${verticalCellPadding}
    ${tableHeaderFontWeight}

    &, &:last-child {
        padding-left: 21.6px;
    }
`;

const THLastStyled = styled(THLast)`
    ${verticalCellPadding};
    ${tableHeaderFontWeight}
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
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 0 12px;
`;

const DropdownTokenIcon = styled(TokenIcon)`
    margin-right: 10px;
    vertical-align: top;
`;

class MarketsDropdown extends React.Component<Props, State> {
    public readonly state: State = {
        selectedFilter: marketFilters[0],
        search: '',
        isUserOnDropdown: false,
    };

    private readonly _dropdown = React.createRef<Dropdown>();

    public render = () => {
        const { currencyPair, baseToken, ...restProps } = this.props;

        const header = (
            <MarketsDropdownHeader>
                <MarketsDropdownHeaderText>
                    {baseToken ? (
                        <DropdownTokenIcon
                            symbol={baseToken.symbol}
                            primaryColor={baseToken.primaryColor}
                            isInline={true}
                            icon={baseToken.icon}
                        />
                    ) : null}
                    {currencyPair.base.toUpperCase()}/{currencyPair.quote.toUpperCase()}
                </MarketsDropdownHeaderText>
                <ChevronDownIcon />
            </MarketsDropdownHeader>
        );

        const body = (
            <MarketsDropdownBody>
                <MarketsFilters onMouseOver={this._setUserOnDropdown} onMouseOut={this._removeUserOnDropdown}>
                    <MarketsFiltersLabel>Markets</MarketsFiltersLabel>
                    {this._getTokensFilterTabs()}
                    {this._getSearchField()}
                </MarketsFilters>
                <TableWrapper>{this._getMarkets()}</TableWrapper>
            </MarketsDropdownBody>
        );
        return (
            <MarketsDropdownWrapper
                body={body}
                header={header}
                ref={this._dropdown}
                shouldCloseDropdownOnClickOutside={!this.state.isUserOnDropdown}
                {...restProps}
            />
        );
    };

    private readonly _setUserOnDropdown = () => {
        this.setState({ isUserOnDropdown: true });
    };

    private readonly _removeUserOnDropdown = () => {
        this.setState({ isUserOnDropdown: false });
    };

    private readonly _getTokensFilterTabs = () => {
        return (
            <TokenFiltersTabs>
                {marketFilters.map((filter: Filter, index) => {
                    return (
                        <TokenFiltersTab
                            active={filter === this.state.selectedFilter}
                            key={index}
                            onClick={this._setTokensFilterTab.bind(this, filter)}
                        >
                            {filter.text}
                        </TokenFiltersTab>
                    );
                })}
            </TokenFiltersTabs>
        );
    };

    private readonly _setTokensFilterTab: any = (filter: Filter) => {
        this.setState({ selectedFilter: filter });
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
        const { search, selectedFilter } = this.state;

        if (!baseToken || !markets) {
            return null;
        }

        const filteredMarkets =
            selectedFilter == null || selectedFilter.value === null
                ? markets
                : filterMarketsByTokenSymbol(markets, selectedFilter.value);
        const searchedMarkets = filterMarketsByString(filteredMarkets, search);

        return (
            <Table>
                <THead>
                    <TR>
                        <THFirstStyled styles={{ textAlign: 'left' }}>Market</THFirstStyled>
                        <THLastStyled styles={{ textAlign: 'center' }}>Price</THLastStyled>
                    </TR>
                </THead>
                <TBody>
                    {searchedMarkets.map((market, index) => {
                        const isActive =
                            market.currencyPair.base === currencyPair.base &&
                            market.currencyPair.quote === currencyPair.quote;
                        const setSelectedMarket = () => this._setSelectedMarket(market.currencyPair);

                        const token = getKnownTokens().getTokenBySymbol(market.currencyPair.base);

                        const baseSymbol = market.currencyPair.base.toUpperCase();
                        const quoteSymbol = market.currencyPair.quote.toUpperCase();

                        return (
                            <TRStyled active={isActive} key={index} onClick={setSelectedMarket}>
                                <CustomTDFirstStyled styles={{ textAlign: 'left', borderBottom: true }}>
                                    <TokenIconAndLabel>
                                        <TokenIcon
                                            symbol={token.symbol}
                                            primaryColor={token.primaryColor}
                                            icon={token.icon}
                                        />
                                        <TokenLabel>
                                            {baseSymbol} / {quoteSymbol}
                                        </TokenLabel>
                                    </TokenIconAndLabel>
                                </CustomTDFirstStyled>
                                <CustomTDLastStyled styles={{ textAlign: 'center', borderBottom: true, tabular: true }}>
                                    {this._getPrice(market)}
                                </CustomTDLastStyled>
                            </TRStyled>
                        );
                    })}
                </TBody>
            </Table>
        );
    };

    private readonly _setSelectedMarket: any = (currencyPair: CurrencyPair) => {
        this.props.changeMarket(currencyPair);
        this.props.goToHome();
        if (this._dropdown.current) {
            this._dropdown.current.closeDropdown();
        }
    };

    private readonly _getPrice: any = (market: Market) => {
        if (market.price) {
            return market.price.toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH);
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
        changeMarket: (currencyPair: CurrencyPair) => dispatch(changeMarket(currencyPair)),
        goToHome: () => dispatch(goToHome()),
    };
};

const MarketsDropdownContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MarketsDropdown);

export { MarketsDropdown, MarketsDropdownContainer };
