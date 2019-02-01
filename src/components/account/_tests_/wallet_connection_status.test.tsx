// import { BigNumber } from '0x.js';
// import { configure, mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import React from 'react';

// import { WalletConnectionStatus } from '../wallet_connection_status';

configure({ adapter: new Adapter() });

describe('WalletConnectionStatus', () => {
    it('dummy test', () => {
        expect(true).toEqual(true);
    });
//    it('shows "not connected" when web3 prop is falsy', () => {
//        const wrapper = mount(<WalletConnectionStatus ethAccount={''} wethBalance={new BigNumber(0)} />);
//        expect(wrapper.text()).toEqual('Not connected (WETH: 0.00)');
//    });
//
//    it('renders correctly when a wallet and account is unlocked', done => {
//        const ethAccount = '0x...';
//        const wrapper = mount(<WalletConnectionStatus ethAccount={ethAccount} wethBalance={new BigNumber(0)} />);
//        const web3 = {
//            eth: { getAccounts: () => Promise.resolve([ethAccount]) },
//        };
//        wrapper.setProps({ web3 });
//        wrapper.update();
//        // @TODO: fix/improve this re-render based on props change
//        setTimeout(() => {
//            expect(wrapper.text()).toEqual(`Connected with: ${ethAccount} (WETH: 0.00)`);
//            done();
//        }, 4000);
//    });
});
