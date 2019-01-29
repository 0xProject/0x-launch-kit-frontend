import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import { WalletConnectionStatus } from '../wallet_connection_status';

configure({ adapter: new Adapter() });

describe('WalletConnectionStatus', () => {
    it('shows "not connected" when web3 prop is falsy', () => {
        const wrapper = mount(<WalletConnectionStatus ethAccount={''} />);
        expect(wrapper.find('p').text()).toEqual('Not connected');
    });

    it('renders correctly when a wallet and account is unlocked', done => {
        const ethAccount = '0x...';
        const wrapper = mount(<WalletConnectionStatus ethAccount={ethAccount} />);
        const web3 = {
            eth: { getAccounts: () => Promise.resolve([ethAccount]) },
        };
        wrapper.setProps({ web3 });
        wrapper.update();
        // @TODO: fix/improve this re-render based on props change
        setTimeout(() => {
            expect(wrapper.find('p').text()).toEqual(`Connected with: ${ethAccount}`);
            done();
        }, 4000);
    });
});
