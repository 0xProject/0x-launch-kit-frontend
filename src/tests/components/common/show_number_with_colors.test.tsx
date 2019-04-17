import { BigNumber } from '0x.js';
import { shallow } from 'enzyme';
import React from 'react';

import { ShowNumberWithColors } from '../../../components/common/show_number_with_colors';

describe('ShowNumberWithColors', () => {
    it('should be initialized with value 123.0000', () => {
        // given
        const value = new BigNumber('123');

        // when
        const wrapper = shallow(<ShowNumberWithColors num={value} />);

        // then
        expect(wrapper).toMatchSnapshot();
    });

    it('should be initialized with value 123.2200', () => {
        // given
        const value = new BigNumber('123.22');

        // when
        const wrapper = shallow(<ShowNumberWithColors num={value} />);

        // then
        expect(wrapper).toMatchSnapshot();
    });
});
