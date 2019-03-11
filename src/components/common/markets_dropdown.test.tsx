import { shallow } from 'enzyme';
import React from 'react';

import { MarketsDropdownContainer } from './markets_dropdown';

describe('Markets Dropdown', () => {
    let wrapper;
    const mapStateToProps = {
        tokens: [],
        selectedToken: '',
    };

    beforeEach(() => {
        wrapper = shallow(<MarketsDropdownContainer {...mapStateToProps} />);
    });

    it('Render the component', () => {
        expect(wrapper.length).toEqual(1);
    });
});
