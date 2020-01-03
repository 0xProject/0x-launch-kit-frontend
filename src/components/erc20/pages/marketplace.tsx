import React, { useState } from 'react';
import { Responsive } from 'react-grid-layout';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { setDynamicLayout, setERC20Layout } from '../../../store/actions';
import { getDynamicLayout, getERC20Layout, getEthAccount } from '../../../store/selectors';
import { isMobile } from '../../../util/screen';
import { FiatOnRampModalContainer } from '../../account/fiat_modal';
import { FiatChooseModalContainer } from '../../account/fiat_onchoose_modal';
import { Button } from '../../common/button';
import { CheckWalletStateModalContainer } from '../../common/check_wallet_state_modal_container';
import { useWindowSize } from '../../common/hooks/window_size_hook';
import { Content } from '../common/content_wrapper';
import { LayoutDropdownContainer } from '../common/layout_dropdown';
import { MarketDetailsContainer } from '../common/market_details';
import { MarketsListContainer } from '../common/markets_list';
import { BuySellContainer } from '../marketplace/buy_sell';
import { allSteps, noWalletSteps } from '../marketplace/joyride-steps';
import { MarketFillsContainer } from '../marketplace/market_fills';
// import GoogleADS from '../../common/google';
import { OrderBookTableContainer } from '../marketplace/order_book';
import { OrderFillsContainer } from '../marketplace/order_fills';
import { OrderHistoryContainer } from '../marketplace/order_history';
import { WalletBalanceContainer } from '../marketplace/wallet_balance';

// const ResponsiveReactGridLayout = WidthProvider(Responsive);

const StyledDiv = styled.div`
    display: flex;
    align-items: flex-end;
    height: 20px;
    width: 100%;
    background-color: ${props => props.theme.componentsTheme.cardBackgroundColor};
    color: ${props => props.theme.componentsTheme.textColorCommon};
`;

const MarketPlaceDiv = styled.div`
    display: block;
`;

const Grid = styled(Responsive)`
    width: 100%;
`;

const StyledButton = styled(Button)`
    background-color: ${props => props.theme.componentsTheme.topbarBackgroundColor};
    color: ${props => props.theme.componentsTheme.textColorCommon};
    &:hover {
        text-decoration: underline;
    }
    margin: 0;
    padding: 0;
    padding-left: 10px;
`;

/*const Label = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    line-height: normal;
    font-size: 16px;
    font-weight: 600;
    margin: 0;
`;

const LabelContainer = styled.div`
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: row;
    display: flex;
    padding-left: 8px;
`;

const FieldContainer = styled.div`
    position: relative;
    padding-left: 2px;
`;*/

/*const ColumnWideDouble = styled.div`
    @media (min-width: ${themeBreakPoints.md}) {
        flex-grow: 3;
    }
`;

const ContentDoubleHeight = styled(Content)`
    @media (min-width: ${themeBreakPoints.xl}) {
        height: calc(200% - ${themeDimensions.footerHeight});
    }
`;*/

/*class Marketplace extends React.PureComponent {
    public render = () => {
        return (
            <>
                <ContentDoubleHeight>
                    <ColumnWide>
                        <MarketsListContainer />
                    </ColumnWide>
                    <ColumnWideDouble>
                        <MarketDetailsContainer />
                    </ColumnWideDouble>
                </ContentDoubleHeight>
                <ContentDoubleHeight>
                    <ColumnNarrow>
                        <WalletBalanceContainer />
                        <BuySellContainer />
                    </ColumnNarrow>
                    <ColumnNarrow>
                        <OrderBookTableContainer />
                    </ColumnNarrow>
                    <ColumnWide>
                        <OrderHistoryContainer />
                        <MarketFillsContainer />
                        <OrderFillsContainer />
                    </ColumnWide>
                    <CheckWalletStateModalContainer />
                    <FiatOnRampModalContainer />
                    <FiatChooseModalContainer />
                </ContentDoubleHeight>
            </>
        );
    };
}*/
/*const initialLayouts = {
    lg: [
        { i: 'a', x: 0, y: 0, w: 4, h: 4 },
        { i: 'b', x: 4, y: 0, w: 8, h: 4 },
        { i: 'c', x: 0, y: 4, w: 3, h: 1 },
        { i: 'd', x: 0, y: 5, w: 3, h: 3 },
        { i: 'e', x: 3, y: 4, w: 3, h: 4 },
        { i: 'f', x: 6, y: 4, w: 6, h: 1 },
        { i: 'g', x: 6, y: 5, w: 6, h: 2 },
        { i: 'h', x: 6, y: 7, w: 6, h: 1 },
        { i: 't', x: 16, y: 14, w: 4, h: 2 },
    ],
};*/

const Marketplace = () => {
    const dispatch = useDispatch();
    const layouts = JSON.parse(useSelector(getERC20Layout));
    const isDynamicLayout = useSelector(getDynamicLayout);
    const ethAccount = useSelector(getEthAccount);
    /**
     * TODO: Remove this workaround. In some states, react-grid-layoyt is not
     * finding the correct way to get the correct width.
     * */
    /*useEffect(()=>{
        setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        dispatch(setERC20Layout(JSON.stringify(layouts)));
    }, 500);
    },[])*/

    const [breakpoint, setBreakPoint] = useState('lg');
    const [isRun, setIsRun] = useState(false);

    const size = useWindowSize();
    const onLayoutChange = (lay: any) => {
        // setLayout(layout);
        //  dispatch(setERC20Layout(JSON.stringify({...layouts, [`${breakpoint}`]:layout}, )))
        dispatch(setERC20Layout(JSON.stringify({ lg: lay })));
    };
    const onBreakpointChange = (br: string) => {
        setBreakPoint(br);
    };
    const onTakeTutorial = () => {
        document.body.style.minHeight = '200vh';
        const root = document.getElementById('root');
        if (root) {
            root.style.minHeight = '200vh';
        }
        setIsRun(true);
    };

    const onDynamicLayout = () => {
        dispatch(setDynamicLayout(!isDynamicLayout));
    };

    const layout: ReactGridLayout.Layout[] = layouts[breakpoint] ? layouts[breakpoint] : layouts.lg;
    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setIsRun(false);
            document.body.style.minHeight = '100vh';
            const root = document.getElementById('root');
            if (root) {
                root.style.minHeight = '100vh';
            }
        }
    };
    /*
    TODO: Add and remove layoyts dynamically*/
    const isMarketList = layout.find(l => l.i === 'a') ? true : false;
    const isMarketDetails = layout.find(l => l.i === 'b') ? true : false;
    const isWalletBalance = layout.find(l => l.i === 'c') ? true : false;
    const isBuySell = layout.find(l => l.i === 'd') ? true : false;
    const isOrderBook = layout.find(l => l.i === 'e') ? true : false;
    const isOrderHistory = layout.find(l => l.i === 'f') ? true : false;
    const isMarketFills = layout.find(l => l.i === 'g') ? true : false;
    const isOrderFills = layout.find(l => l.i === 'h') ? true : false;
    let content;
    if (isMobile(size.width)) {
        content = (
            <Content>
                <BuySellContainer />
                <OrderBookTableContainer />
                <MarketDetailsContainer isTradingGraphic={false} />
                <WalletBalanceContainer />
                <OrderHistoryContainer />
                <MarketFillsContainer />
                <OrderFillsContainer />
            </Content>
        );
    } else {
        const cards = [];
        if (isMarketList) {
            cards.push(
                <div key="a" className="markets-list">
                    <MarketsListContainer />
                </div>,
            );
        }

        if (isMarketDetails) {
            cards.push(
                <div key="b" className="market-details">
                    <MarketDetailsContainer isTradingGraphic={true} />
                </div>,
            );
        }

        if (isWalletBalance) {
            cards.push(
                <div key="c" className="wallet-balance">
                    <WalletBalanceContainer />
                </div>,
            );
        }
        if (isBuySell) {
            cards.push(
                <div key="d" className="buy-sell">
                    <BuySellContainer />
                </div>,
            );
        }

        if (isOrderBook) {
            cards.push(
                <div key="e" className="orderbook">
                    <OrderBookTableContainer />
                </div>,
            );
        }
        if (isOrderHistory) {
            cards.push(
                <div key="f" className="orderhistory">
                    <OrderHistoryContainer />
                </div>,
            );
        }
        if (isMarketFills) {
            cards.push(
                <div key="g" className="market-fills">
                    <MarketFillsContainer />
                </div>,
            );
        }
        if (isOrderFills) {
            cards.push(
                <div key="h" className="order-fills">
                    <OrderFillsContainer />
                </div>,
            );
        }

        content = (
            <MarketPlaceDiv>
                <StyledDiv>
                    <LayoutDropdownContainer />
                    <StyledButton onClick={onDynamicLayout}>
                        {isDynamicLayout ? 'Dynamic Layout' : 'Static Layout'}
                    </StyledButton>
                    <StyledButton onClick={onTakeTutorial}>Take Tour </StyledButton>
                </StyledDiv>
                <Joyride
                    run={isRun}
                    steps={ethAccount ? allSteps : noWalletSteps}
                    callback={handleJoyrideCallback}
                    continuous={true}
                    disableOverlay={true}
                    showSkipButton={true}
                    scrollToFirstStep={true}
                    disableScrollParentFix={false}
                    showProgress={true}
                    styles={{
                        options: {
                            zIndex: 10000,
                        },
                    }}
                />
                <Grid
                    className="layout"
                    layouts={layouts}
                    width={size.width}
                    onLayoutChange={onLayoutChange}
                    isResizable={isDynamicLayout}
                    isDraggable={isDynamicLayout}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    onBreakpointChange={onBreakpointChange}
                >
                    {cards}
                </Grid>
            </MarketPlaceDiv>
        );
    }

    return (
        <>
            {content}
            <CheckWalletStateModalContainer />
            <FiatOnRampModalContainer />
            <FiatChooseModalContainer />
        </>
    );
};

export { Marketplace as default };

/*<GoogleADS client={'ca-pub-8425903251487932'} slot={'3929149992'}  format={'auto'} responsive={'auto'}/>
                    <GoogleADS client={'ca-pub-8425903251487932'} slot={'2421724683'}  format={'auto'} responsive={'auto'}/>
        <GoogleADS client={'ca-pub-8425903251487932'} slot={'7055050362'}  format={'auto'} responsive={'auto'}/> */
