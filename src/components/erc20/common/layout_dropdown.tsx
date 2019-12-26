import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { setERC20Layout } from '../../../store/actions';
import { getERC20Layout } from '../../../store/selectors';
import { ButtonVariant } from '../../../util/types';
import { Button } from '../../common/button';
import { CardBase } from '../../common/card_base';
import { Dropdown, DropdownPositions } from '../../common/dropdown';
import { ChevronDownIcon } from '../../common/icons/chevron_down_icon';

const LayoutDropdownHeaderWrapper = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
`;

export const WalletConnectionStatusText = styled.span`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-feature-settings: 'calt' 0;
    font-size: 16px;
    font-weight: 500;
    margin-right: 10px;
`;

const DropdownBody = styled(CardBase)`
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    box-shadow: ${props => props.theme.componentsTheme.boxShadow};
    max-height: 100%;
    max-width: 100%;
    width: 190px;
    height: 260px;
`;
const DropdownWrapper = styled(Dropdown)`
    z-index: 100;
`;

export const Label = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
`;

export const LabelContainer = styled.div`
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: row;
    display: flex;
    padding-right: 8px;
`;

export const ButtonContainer = styled.div`
    justify-content: center;
    flex-direction: row;
    display: flex;
`;

export const StyledButton = styled(Button)`
    padding: 8px;
    margin-bottom: 2px;
`;

export const FieldContainer = styled.div`
    position: relative;
`;

const defaultLayouts = {
    a: { i: 'a', x: 0, y: 0, w: 4, h: 4 },
    b: { i: 'b', x: 4, y: 0, w: 8, h: 4 },
    c: { i: 'c', x: 0, y: 4, w: 3, h: 1 },
    d: { i: 'd', x: 0, y: 5, w: 3, h: 3 },
    e: { i: 'e', x: 3, y: 4, w: 3, h: 4 },
    f: { i: 'f', x: 6, y: 4, w: 6, h: 1 },
    g: { i: 'g', x: 6, y: 5, w: 6, h: 2 },
    h: { i: 'h', x: 6, y: 7, w: 6, h: 1 },
};

const resetLayouts = {
    lg: [
        { i: 'a', x: 0, y: 0, w: 4, h: 4 },
        { i: 'b', x: 4, y: 0, w: 8, h: 4 },
        { i: 'c', x: 0, y: 4, w: 3, h: 1 },
        { i: 'd', x: 0, y: 5, w: 3, h: 3 },
        { i: 'e', x: 3, y: 4, w: 3, h: 4 },
        { i: 'f', x: 6, y: 4, w: 6, h: 1 },
        { i: 'g', x: 6, y: 5, w: 6, h: 2 },
        { i: 'h', x: 6, y: 7, w: 6, h: 1 },
    ],
};

// const defaultBreakPoints = ['lg', 'md', 'xs', 'sm', 'xs', 'xss'];
type keyType = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
const mutateLayoutsByReference = (layouts: ReactGridLayout.Layouts, isSet: boolean, key: keyType) => {
    if (isSet) {
        Object.keys(layouts).forEach(lay => {
            layouts[lay].push(defaultLayouts[key]);
        });
    } else {
        Object.keys(layouts).forEach(lay => {
            const index = layouts[lay].findIndex(l => l.i === key);
            if (index !== -1) {
                layouts[lay].splice(index, 1);
            }
        });
    }
};
const getLayoutValue = (layouts: ReactGridLayout.Layouts, key: keyType) => {
    const index = layouts.lg.findIndex(l => l.i === key);
    if (index !== -1) {
        return true;
    }
    return false;
};

export const LayoutDropdownContainer = (props: any) => {
    const header = (
        <LayoutDropdownHeaderWrapper>
            <WalletConnectionStatusText>⚙</WalletConnectionStatusText>
            <ChevronDownIcon />
        </LayoutDropdownHeaderWrapper>
    );
    const layouts: ReactGridLayout.Layouts = JSON.parse(useSelector(getERC20Layout));
    const dispatch = useDispatch();

    const [isMarketList, setMarketList] = useState(getLayoutValue(layouts, 'a'));
    const [isMarketDetails, setMarketDetails] = useState(getLayoutValue(layouts, 'b'));
    const [isWalletBalance, setWalletBalance] = useState(getLayoutValue(layouts, 'c'));
    const [isBuySell, setBuySell] = useState(getLayoutValue(layouts, 'd'));
    const [isOrderBook, setOrderBook] = useState(getLayoutValue(layouts, 'e'));
    const [isOrderHistory, setOrderHistory] = useState(getLayoutValue(layouts, 'f'));
    const [isMarketFills, setMarketFills] = useState(getLayoutValue(layouts, 'g'));
    const [is0xLastTrades, set0xLastTrades] = useState(getLayoutValue(layouts, 'h'));

    const onResetLayout = () => {
        dispatch(setERC20Layout(JSON.stringify(resetLayouts)));
        setMarketList(true);
        setMarketDetails(true);
        setWalletBalance(true);
        setBuySell(true);
        setOrderBook(true);
        setOrderHistory(true);
        setMarketFills(true);
        set0xLastTrades(true);
    };

    const onMarketListChecked = () => {
        setMarketList(!isMarketList);
        mutateLayoutsByReference(layouts, !isMarketList, 'a');
        dispatch(setERC20Layout(JSON.stringify(layouts)));
    };
    const onMarketDetailsChecked = () => {
        setMarketDetails(!isMarketDetails);
        mutateLayoutsByReference(layouts, !isMarketDetails, 'b');
        dispatch(setERC20Layout(JSON.stringify(layouts)));
    };

    const onWalletBalanceChecked = () => {
        setWalletBalance(!isWalletBalance);
        mutateLayoutsByReference(layouts, !isWalletBalance, 'c');
        dispatch(setERC20Layout(JSON.stringify(layouts)));
    };

    const onBuySellChecked = () => {
        setBuySell(!isBuySell);
        mutateLayoutsByReference(layouts, !isBuySell, 'd');
        dispatch(setERC20Layout(JSON.stringify(layouts)));
    };

    const onOrderBookChecked = () => {
        setOrderBook(!isOrderBook);
        mutateLayoutsByReference(layouts, !isOrderBook, 'e');
        dispatch(setERC20Layout(JSON.stringify(layouts)));
    };

    const onOrderHistoryChecked = () => {
        setOrderHistory(!isOrderHistory);
        mutateLayoutsByReference(layouts, !isOrderHistory, 'f');
        dispatch(setERC20Layout(JSON.stringify(layouts)));
    };
    const onMarketFillsChecked = () => {
        setMarketFills(!isMarketFills);
        mutateLayoutsByReference(layouts, !isMarketFills, 'g');
        dispatch(setERC20Layout(JSON.stringify(layouts)));
    };
    const on0xLastTradesChecked = () => {
        set0xLastTrades(!is0xLastTrades);
        mutateLayoutsByReference(layouts, !is0xLastTrades, 'h');
        dispatch(setERC20Layout(JSON.stringify(layouts)));
    };

    const body = (
        <>
            <DropdownBody>
                <LabelContainer>
                    <Label>Markets List</Label>
                    <FieldContainer>
                        <input type="checkbox" checked={isMarketList} onChange={onMarketListChecked} />
                    </FieldContainer>
                </LabelContainer>
                <LabelContainer>
                    <Label>Market Details</Label>
                    <FieldContainer>
                        <input type="checkbox" checked={isMarketDetails} onChange={onMarketDetailsChecked} />
                    </FieldContainer>
                </LabelContainer>
                <LabelContainer>
                    <Label>Wallet Balances</Label>
                    <FieldContainer>
                        <input type="checkbox" checked={isWalletBalance} onChange={onWalletBalanceChecked} />
                    </FieldContainer>
                </LabelContainer>
                <LabelContainer>
                    <Label>Buy/Sell Card</Label>
                    <FieldContainer>
                        <input type="checkbox" checked={isBuySell} onChange={onBuySellChecked} />
                    </FieldContainer>
                </LabelContainer>
                <LabelContainer>
                    <Label>Order Book</Label>
                    <FieldContainer>
                        <input type="checkbox" checked={isOrderBook} onChange={onOrderBookChecked} />
                    </FieldContainer>
                </LabelContainer>
                <LabelContainer>
                    <Label>My Current Orders</Label>
                    <FieldContainer>
                        <input type="checkbox" checked={isOrderHistory} onChange={onOrderHistoryChecked} />
                    </FieldContainer>
                </LabelContainer>
                <LabelContainer>
                    <Label>Market Fills</Label>
                    <FieldContainer>
                        <input type="checkbox" checked={isMarketFills} onChange={onMarketFillsChecked} />
                    </FieldContainer>
                </LabelContainer>
                <LabelContainer>
                    <Label>0x Last Trades</Label>
                    <FieldContainer>
                        <input type="checkbox" checked={is0xLastTrades} onChange={on0xLastTradesChecked} />
                    </FieldContainer>
                </LabelContainer>
                <ButtonContainer>
                    <StyledButton onClick={onResetLayout} variant={ButtonVariant.Tertiary}>
                        Reset Layout
                    </StyledButton>
                </ButtonContainer>
            </DropdownBody>
        </>
    );

    return (
        <DropdownWrapper
            body={body}
            header={header}
            horizontalPosition={DropdownPositions.Left}
            shouldCloseDropdownOnClickOutside={false}
            {...props}
        />
    );
};
