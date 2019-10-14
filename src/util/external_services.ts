import { FEE_RECIPIENT } from '../common/constants';

export const connectToExplorer = () => {
    window.open(`https://0xtracker.com/search?q=${FEE_RECIPIENT}`);
};

export const viewOnFabrx = (ethAccount: string) => {
    window.open(
        `https://dash.fabrx.io/thread/partner/VeriDex&a3bccf&1127661506559188992--K_DyiHA0_400x400--jpg&ETH&${ethAccount}/`,
    );
};
