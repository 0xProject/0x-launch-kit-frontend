/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { MarketsDropdownContainer } from '../../../components/erc20/common/markets_dropdown';

const mockStore = configureMockStore([]);

describe('Markets Dropdown', () => {
    let wrapper;
    const store = mockStore({});

    beforeEach(() => {
        wrapper = shallow(
            <Provider store={store}>
                <MarketsDropdownContainer />
            </Provider>,
        );
    });

    it('Render the component', () => {
        expect(wrapper.length).toEqual(1);
    });
});
