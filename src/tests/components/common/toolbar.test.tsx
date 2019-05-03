import { shallow } from 'enzyme';
import React from 'react';

import { Toolbar } from '../../../components/common/toolbar';

describe('Toolbar', () => {
    it('Toolbar to match snapshot', () => {
        // given
        const toolbar = <Toolbar startContent={null} endContent={null} />;

        // when
        const wrapper = shallow(toolbar);

        // then
        expect(wrapper).toMatchSnapshot();
    });
});
