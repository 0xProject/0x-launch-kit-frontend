/**
 * @jest-environment jsdom
 */

import { BigNumber } from '0x.js';
import { mount } from 'enzyme';
import React from 'react';

import { TradeButton } from '../../../../components/erc721/marketplace/trade_button';
import { addressFactory, collectibleFactory } from '../../../../util/test-utils';
import { mountWithTheme } from '../../../util/test_with_theme';

describe('TradeButton', () => {
    describe('the collectible belongs to the current user and it does not have a price', () => {
        const currentUser = addressFactory.build().address;
        const collectible = collectibleFactory.build({ currentOwner: currentUser });

        it('should display a sell button', () => {
            // when
            const wrapper = mountWithTheme(
                <TradeButton
                    asset={collectible}
                    ethAccount={currentUser}
                    onBuy={jest.fn()}
                    onSell={jest.fn()}
                    onCancel={jest.fn()}
                />,
            );

            // then
            const result = wrapper.text();
            expect(result).toContain('Sell');
        });

        it('should call the onSell callback', () => {
            // given
            const onBuy = jest.fn();
            const onSell = jest.fn();
            const onCancel = jest.fn();

            // when
            const wrapper = mountWithTheme(
                <TradeButton
                    asset={collectible}
                    ethAccount={currentUser}
                    onBuy={onBuy}
                    onSell={onSell}
                    onCancel={onCancel}
                />,
            );
            wrapper.simulate('click');

            // then
            expect(onBuy).not.toHaveBeenCalled();
            expect(onSell).toHaveBeenCalled();
            expect(onCancel).not.toHaveBeenCalled();
        });
    });

    describe('the collectible belongs to the current user and it does not have a price', () => {
        const currentUser = addressFactory.build().address;
        const collectible = collectibleFactory.build({
            order: { takerAssetAmount: new BigNumber(5) },
            currentOwner: currentUser,
        });

        it('should display a cancel button', () => {
            // when
            const wrapper = mountWithTheme(
                <TradeButton
                    asset={collectible}
                    ethAccount={currentUser}
                    onBuy={jest.fn()}
                    onSell={jest.fn()}
                    onCancel={jest.fn()}
                />,
            );

            // then
            const result = wrapper.text();
            expect(result).toContain('Cancel');
        });

        it('should call the onCancel callback', () => {
            // given
            const onBuy = jest.fn();
            const onSell = jest.fn();
            const onCancel = jest.fn();

            // when
            const wrapper = mountWithTheme(
                <TradeButton
                    asset={collectible}
                    ethAccount={currentUser}
                    onBuy={onBuy}
                    onSell={onSell}
                    onCancel={onCancel}
                />,
            );
            wrapper.simulate('click');

            // then
            expect(onBuy).not.toHaveBeenCalled();
            expect(onSell).not.toHaveBeenCalled();
            expect(onCancel).toHaveBeenCalled();
        });
    });

    describe('the collectible does not belong to the current user and it has a price', () => {
        const currentUser = addressFactory.build().address;
        const collectible = collectibleFactory.build({ order: { takerAssetAmount: new BigNumber(5) } });

        it('should display a buy button', () => {
            // when
            const wrapper = mountWithTheme(
                <TradeButton
                    asset={collectible}
                    ethAccount={currentUser}
                    onBuy={jest.fn()}
                    onSell={jest.fn()}
                    onCancel={jest.fn()}
                />,
            );

            // then
            const result = wrapper.text();
            expect(result).toContain('Buy');
        });

        it('should call the onBuy callback', () => {
            // given
            const onBuy = jest.fn();
            const onSell = jest.fn();
            const onCancel = jest.fn();

            // when
            const wrapper = mountWithTheme(
                <TradeButton
                    asset={collectible}
                    ethAccount={currentUser}
                    onBuy={onBuy}
                    onSell={onSell}
                    onCancel={onCancel}
                />,
            );
            wrapper.simulate('click');

            // then
            expect(onBuy).toHaveBeenCalled();
            expect(onSell).not.toHaveBeenCalled();
            expect(onCancel).not.toHaveBeenCalled();
        });
    });

    describe('the collectible does not belong to the current user and it does not have a price', () => {
        const currentUser = addressFactory.build().address;
        const collectible = collectibleFactory.build({ order: null });

        it('should return null', () => {
            // when
            const wrapper = mount(
                <TradeButton
                    asset={collectible}
                    ethAccount={currentUser}
                    onBuy={jest.fn()}
                    onSell={jest.fn()}
                    onCancel={jest.fn()}
                />,
            );

            // then
            expect(wrapper.html()).toBeNull();
        });
    });
});
