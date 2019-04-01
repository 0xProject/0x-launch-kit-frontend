import { BigNumber } from '0x.js';

import { NOTIFICATIONS_LIMIT } from '../common/constants';
import { Notification } from '../util/types';

const addPrefix = (key: string) => `0x-launch-kit-frontend.${key}`;

const notificationsKey = addPrefix('notifications');
const hasUnreadNotificationsKey = addPrefix('hasUnreadNotifications');
const lastBlockCheckedKey = addPrefix('lastBlockChecked');
const adBlockMessageShownKey = addPrefix('adBlockMessageShown');

export class LocalStorage {
    private readonly _storage: Storage;

    constructor(storage: Storage = localStorage) {
        this._storage = storage;
    }

    public saveNotifications(notifications: Notification[], account: string): void {
        console.log("saving notifications", notifications)
        const currentNotifications = JSON.parse(this._storage.getItem(notificationsKey) || '{}');
        const networkId = 50;
        // Sort array by timestamp property
        const sortedNotifications = notifications.sort((a: Notification, b: Notification) => {
            const aTimestamp = a.timestamp ? a.timestamp.getTime() : 0;
            const bTimestamp = b.timestamp ? b.timestamp.getTime() : 0;
            return bTimestamp - aTimestamp;
        });
        const newNotifications = {
            ...currentNotifications,
            [networkId]: {
                [account]: sortedNotifications,
            },
        };
        // Limit number of notifications
        if (newNotifications[networkId][account].length > NOTIFICATIONS_LIMIT) {
            newNotifications[networkId][account].length = NOTIFICATIONS_LIMIT;
        }

        this._storage.setItem(notificationsKey, JSON.stringify(newNotifications));
    }

    public getNotifications(account: string): Notification[] {
        const notificationsJSON = this._storage.getItem(notificationsKey);
        if (!notificationsJSON) {
            return [];
        }
        const currentNotifications = JSON.parse(notificationsJSON, (key: string, value: string) => {
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
        });
        const networkId = 50;
        return currentNotifications[networkId][account] || [];
    }

    public saveHasUnreadNotifications(hasUnreadNotifications: boolean, account: string): void {
        const currentStatuses = JSON.parse(this._storage.getItem(hasUnreadNotificationsKey) || '{}');
        const networkId = 50;
        const newStatuses = {
            ...currentStatuses,
            [networkId]: {
                [account]: hasUnreadNotifications,
            },
        };

        this._storage.setItem(hasUnreadNotificationsKey, JSON.stringify(newStatuses));
    }

    public getHasUnreadNotifications(account: string): boolean {
        const currentNotifications = JSON.parse(this._storage.getItem(hasUnreadNotificationsKey) || '{}');
        const networkId = 50;
        if (currentNotifications[networkId] && currentNotifications[networkId][account]) {
            return currentNotifications[networkId][account];
        }
        return false;
    }

    public saveLastBlockChecked(lastBlockChecked: number, account: string): void {
        const currentBlocks = JSON.parse(this._storage.getItem(lastBlockCheckedKey) || '{}');
        const networkId = 50;
        const newBlocks = {
            ...currentBlocks,
            [networkId]: {
                [account]: lastBlockChecked,
            },
        };

        this._storage.setItem(lastBlockCheckedKey, JSON.stringify(newBlocks));
    }

    public getLastBlockChecked(account: string): number | null {
        const currentLastBlockChecked = JSON.parse(this._storage.getItem(lastBlockCheckedKey) || '{}');
        const networkId = 50;
        if (currentLastBlockChecked[networkId] && currentLastBlockChecked[networkId][account]) {
            return currentLastBlockChecked[networkId][account];
        }
        return null;
    }

    public saveAdBlockMessageShown(adBlockMessageShown: boolean): void {
        this._storage.setItem(adBlockMessageShownKey, JSON.stringify(adBlockMessageShown));
    }

    public getAdBlockMessageShown(): boolean {
        return JSON.parse(this._storage.getItem(adBlockMessageShownKey) || 'false');
    }
}
