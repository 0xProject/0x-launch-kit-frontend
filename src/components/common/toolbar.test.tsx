import { shallow } from 'enzyme';
import React from 'react';

import { Toolbar } from './toolbar';

describe('Toolbar', () => {
    it('Toolbar to match snapshot', () => {
        // given
        const toolbar = <Toolbar />;

        // when
        const wrapper = shallow(toolbar);

        // then
        expect(wrapper).toMatchSnapshot();
    });
});
