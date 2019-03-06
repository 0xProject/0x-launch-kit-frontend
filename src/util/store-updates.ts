import { UI_UPDATE_CHECK_INTERVAL } from '../common/constants';
import { updateStore } from '../store/actions';

let isActiveCheckUpdates: boolean = false;

export const enableRealtimeUpdates = () => {
    if (!isActiveCheckUpdates) {
        setInterval(async () => {
            updateStore();
            isActiveCheckUpdates = true;
        }, UI_UPDATE_CHECK_INTERVAL);
    }
};
