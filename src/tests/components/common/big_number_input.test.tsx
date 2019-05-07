/**
 * @jest-environment jsdom
 */

import { BigNumber } from '0x.js';
import { mount } from 'enzyme';
import React from 'react';

import { BigNumberInput } from '../../../components/common/big_number_input';
import { mountWithTheme } from '../../util/test_with_theme';

const noop = () => ({});

describe('BigNumberInput', () => {
    it('should be initialized with value', () => {
        // given
        const value = new BigNumber('123');

        // when
        const wrapper = mountWithTheme(<BigNumberInput value={value} decimals={2} onChange={noop} />);

        // then
        expect(wrapper.find('input').props().value).toEqual('1.23');
    });

    it('should trigger the onChange callback with the proper value', () => {
        // given
        const value = new BigNumber('123');
        const onChange = jest.fn();

        // when
        const wrapper = mountWithTheme(<BigNumberInput value={value} decimals={2} onChange={onChange} />);
        changeValue(wrapper, '2.45');

        // then
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(new BigNumber('245'));
    });

    it('should change when value changes', () => {
        // given
        const value = new BigNumber('123');
        const onChange = jest.fn();

        // when
        const wrapper = mount(<BigNumberInput value={value} decimals={2} onChange={onChange} />);

        // then
        expect(wrapper.find('input').props().value).toEqual('1.23');

        // when
        wrapper.setProps({ value: new BigNumber('245') });

        // then
        expect(wrapper.find('input').props().value).toEqual('2.45');
    });

    it('should allow entering an empty string', () => {
        // given
        const value = new BigNumber('123');
        const onChange = jest.fn();
        // when

        const wrapper = mountWithTheme(<BigNumberInput value={value} decimals={2} onChange={onChange} />);
        changeValue(wrapper, '');

        // then
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(new BigNumber('0'));
    });

    it('should accept a min value', () => {
        // given
        const value = new BigNumber('123');
        const onChange = jest.fn();
        const minValue = new BigNumber('100');

        // when
        const wrapper = mountWithTheme(
            <BigNumberInput min={minValue} value={value} decimals={2} onChange={onChange} />,
        );
        changeValue(wrapper, '0.5');

        // then
        expect(wrapper.find('input').props().value).toEqual('1.23');
        expect(onChange).toHaveBeenCalledTimes(0);
    });

    it('should accept a max value', () => {
        // given
        const value = new BigNumber('123');
        const onChange = jest.fn();
        const maxValue = new BigNumber('200');

        // when
        const wrapper = mountWithTheme(
            <BigNumberInput max={maxValue} value={value} decimals={2} onChange={onChange} />,
        );
        changeValue(wrapper, '3.5');

        // then
        expect(wrapper.find('input').props().value).toEqual('1.23');
        expect(onChange).toHaveBeenCalledTimes(0);
    });

    it('should allow initialize with an empty string', () => {
        // given
        const value = null;
        const onChange = jest.fn();
        // when

        const wrapper = mountWithTheme(<BigNumberInput value={value} decimals={2} onChange={onChange} />);

        // then
        expect(wrapper.find('input').props().value).toEqual('');
        expect(onChange).toHaveBeenCalledTimes(0);
    });
});

function changeValue(wrapper: any, value: string): void {
    (wrapper.find('input').instance() as any).value = value;
    wrapper.find('input').simulate('change');
}
