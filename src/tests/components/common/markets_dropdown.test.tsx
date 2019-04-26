import { shallow } from 'enzyme';
import React from 'react';

import { MarketsDropdown } from '../../../components/common/markets_dropdown';
import { tokenFactory } from '../../../util/test-utils';
import { TokenSymbol } from '../../../util/types';

describe('Markets Dropdown', () => {
    let wrapper;
    const noop = () => ({});
    const currencyPair = {
        base: TokenSymbol.Zrx,
        quote: TokenSymbol.Weth,
    };
    beforeEach(() => {
        wrapper = shallow(
            <MarketsDropdown
                baseToken={tokenFactory.build()}
                changeMarket={noop}
                currencyPair={currencyPair}
                goToHome={noop}
                markets={null}
            />,
        );
    });

    it('Render the component', () => {
        expect(wrapper.length).toEqual(1);
    });
});
