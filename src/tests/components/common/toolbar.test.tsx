import { shallow } from 'enzyme';
import React from 'react';

import { Toolbar } from '../../../erc20/components/common/toolbar';

describe('Toolbar', () => {
    it('Toolbar to match snapshot', () => {
        // given
        const toolbar = <Toolbar onGoToHome={jest.fn()} onGoToWallet={jest.fn()} />;

        // when
        const wrapper = shallow(toolbar);

        // then
        expect(wrapper).toMatchSnapshot();
    });
});
