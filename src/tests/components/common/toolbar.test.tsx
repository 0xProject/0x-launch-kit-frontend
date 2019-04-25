import { shallow } from 'enzyme';
import React from 'react';

import { Toolbar } from '../../../components/common/toolbar';
import { WhiteTheme } from '../../../themes/WhiteTheme';

describe('Toolbar', () => {
    it('Toolbar to match snapshot', () => {
        // given
        const toolbar = <Toolbar onGoToHome={jest.fn()} onGoToWallet={jest.fn()} themeColors={new WhiteTheme()} />;

        // when
        const wrapper = shallow(toolbar);

        // then
        expect(wrapper).toMatchSnapshot();
    });
});
