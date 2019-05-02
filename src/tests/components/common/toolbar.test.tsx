import { shallow } from 'enzyme';
import React from 'react';

import { ToolbarErc20 } from '../../../components/common/toolbar_erc20';

describe('Toolbar', () => {
    it('Toolbar to match snapshot', () => {
        // given
        const toolbar = <ToolbarErc20 onGoToHome={jest.fn()} onGoToWallet={jest.fn()} />;

        // when
        const wrapper = shallow(toolbar);

        // then
        expect(wrapper).toMatchSnapshot();
    });
});
