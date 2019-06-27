import { BigNumber } from '0x.js';

import { FILLS_LIMIT, NETWORK_ID, NOTIFICATIONS_LIMIT  } from '../common/constants';
import { Fill, Notification } from '../util/types';

const addPrefix = (key: string) => `VeriDex.${key}`;

const notificationsKey = addPrefix('notifications');
const fillsKey = addPrefix('fills');
const hasUnreadNotificationsKey = addPrefix('hasUnreadNotifications');
const lastBlockCheckedKey = addPrefix('lastBlockChecked');
const adBlockMessageShownKey = addPrefix('adBlockMessageShown');
const walletConnectedKey = addPrefix('walletConnected');

export class LocalStorage {
    private readonly _storage: Storage;

    constructor(storage: Storage = localStorage) {
        this._storage = storage;
    }

    public saveNotifications(notifications: Notification[], account: string): void {
        const currentNotifications = JSON.parse(this._storage.getItem(notificationsKey) || '{}');
        const newNotifications = {
            ...currentNotifications,
            [NETWORK_ID]: {
                ...currentNotifications[NETWORK_ID],
                [account]: notifications,
            },
        };
        // Sort array by timestamp property
        newNotifications[NETWORK_ID][account] = newNotifications[NETWORK_ID][account].sort(
            (a: Notification, b: Notification) => {
                const aTimestamp = a.timestamp ? a.timestamp.getTime() : 0;
                const bTimestamp = b.timestamp ? b.timestamp.getTime() : 0;
                return bTimestamp - aTimestamp;
            },
        );
        // Limit number of notifications
        if (newNotifications[NETWORK_ID][account].length > NOTIFICATIONS_LIMIT) {
            newNotifications[NETWORK_ID][account].length = NOTIFICATIONS_LIMIT;
        }

        this._storage.setItem(notificationsKey, JSON.stringify(newNotifications));
    }

    public getNotifications(account: string): Notification[] {
        const currentNotifications = JSON.parse(
            this._storage.getItem(notificationsKey) || '{}',
            (key: string, value: string) => {
                if (key === 'amount') {
                    return new BigNumber(value);
                }
                if (key === 'timestamp') {
                    return new Date(value);
                }
                if (key === 'tx') {
                    return Promise.resolve();
                }
                return value;
            },
        );
        if (currentNotifications[NETWORK_ID] && currentNotifications[NETWORK_ID][account]) {
            return currentNotifications[NETWORK_ID][account];
        }
        return [];
    }




    public saveHasUnreadNotifications(hasUnreadNotifications: boolean, account: string): void {
        const currentStatuses = JSON.parse(this._storage.getItem(hasUnreadNotificationsKey) || '{}');
        const newStatuses = {
            ...currentStatuses,
            [NETWORK_ID]: {
                ...currentStatuses[NETWORK_ID],
                [account]: hasUnreadNotifications,
            },
        };

        this._storage.setItem(hasUnreadNotificationsKey, JSON.stringify(newStatuses));
    }

    public getHasUnreadNotifications(account: string): boolean {
        const currentNotifications = JSON.parse(this._storage.getItem(hasUnreadNotificationsKey) || '{}');
        if (currentNotifications[NETWORK_ID] && currentNotifications[NETWORK_ID][account]) {
            return currentNotifications[NETWORK_ID][account];
        }
        return false;
    }
    public getFills(account: string): Fill[] {
        const currentFills = JSON.parse(
            this._storage.getItem(fillsKey) || '{}',
            (key: string, value: string) => {
                if (key === 'amountQuote' || key === 'amountBase') {
                    return new BigNumber(value);
                }
                if (key === 'timestamp') {
                    return new Date(value);
                }
                if (key === 'tx') {
                    return Promise.resolve();
                }
                return value;
            },
        );
      
        if (currentFills[NETWORK_ID] && currentFills[NETWORK_ID][account]) {
            return currentFills[NETWORK_ID][account];
        }
        return [];
    }
    
    public saveFills(fills: Fill[], account: string): void {
        const currentFills = JSON.parse(this._storage.getItem(fillsKey) || '{}');
        const newFills = {
            ...currentFills,
            [NETWORK_ID]: {
                ...currentFills[NETWORK_ID],
                [account]: fills,
            },
        };
        // Sort array by timestamp property
        newFills[NETWORK_ID][account] = newFills[NETWORK_ID][account].sort(
                (a: Fill, b: Fill) => {
                    const aTimestamp = a.timestamp ? a.timestamp.getTime() : 0;
                    const bTimestamp = b.timestamp ? b.timestamp.getTime() : 0;
                    return bTimestamp - aTimestamp;
                },
        );
        // Limit number of fills
        if (newFills[NETWORK_ID][account].length > FILLS_LIMIT) {
            newFills[NETWORK_ID][account].length = FILLS_LIMIT;
        }

        this._storage.setItem(fillsKey, JSON.stringify(newFills));
    }




    public saveLastBlockChecked(lastBlockChecked: number, account: string): void {
        const currentBlocks = JSON.parse(this._storage.getItem(lastBlockCheckedKey) || '{}');
        const newBlocks = {
            ...currentBlocks,
            [NETWORK_ID]: {
                ...currentBlocks[NETWORK_ID],
                [account]: lastBlockChecked,
            },
        };

        this._storage.setItem(lastBlockCheckedKey, JSON.stringify(newBlocks));
    }

    public getLastBlockChecked(account: string): number | null {
        const currentLastBlockChecked = JSON.parse(this._storage.getItem(lastBlockCheckedKey) || '{}');
        if (currentLastBlockChecked[NETWORK_ID] && currentLastBlockChecked[NETWORK_ID][account]) {
            return currentLastBlockChecked[NETWORK_ID][account];
        }
        return null;
    }

    public saveAdBlockMessageShown(adBlockMessageShown: boolean): void {
        this._storage.setItem(adBlockMessageShownKey, JSON.stringify(adBlockMessageShown));
    }

    public getAdBlockMessageShown(): boolean {
        return JSON.parse(this._storage.getItem(adBlockMessageShownKey) || 'false');
    }

    public saveWalletConnected(walletConnected: boolean): void {
        this._storage.setItem(walletConnectedKey, JSON.stringify(walletConnected));
    }

    public getWalletConnected(): boolean {
        return JSON.parse(this._storage.getItem(walletConnectedKey) || 'false');
    }
}
