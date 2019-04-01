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

    public saveNotifications(notifications: Notification[], account: string, networkId: number): void {
        const currentNotifications = JSON.parse(this._storage.getItem(notificationsKey) || '{}');
        const newNotifications = {
            ...currentNotifications,
            [networkId]: {
                ...currentNotifications[networkId],
                [account]: notifications,
            },
        };
        // Sort array by timestamp property
        newNotifications[networkId][account] = newNotifications[networkId][account].sort((a: Notification, b: Notification) => {
            const aTimestamp = a.timestamp ? a.timestamp.getTime() : 0;
            const bTimestamp = b.timestamp ? b.timestamp.getTime() : 0;
            return bTimestamp - aTimestamp;
        });
        // Limit number of notifications
        if (newNotifications[networkId][account].length > NOTIFICATIONS_LIMIT) {
            newNotifications[networkId][account].length = NOTIFICATIONS_LIMIT;
        }

        this._storage.setItem(notificationsKey, JSON.stringify(newNotifications));
    }

    public getNotifications(account: string, networkId: number): Notification[] {
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
        if (currentNotifications[networkId] && currentNotifications[networkId][account]) {
            return currentNotifications[networkId][account];
        }
        return [];
    }

    public saveHasUnreadNotifications(hasUnreadNotifications: boolean, account: string, networkId: number): void {
        const currentStatuses = JSON.parse(this._storage.getItem(hasUnreadNotificationsKey) || '{}');
        const newStatuses = {
            ...currentStatuses,
            [networkId]: {
                ...currentStatuses[networkId],
                [account]: hasUnreadNotifications,
            },
        };

        this._storage.setItem(hasUnreadNotificationsKey, JSON.stringify(newStatuses));
    }

    public getHasUnreadNotifications(account: string, networkId: number): boolean {
        const currentNotifications = JSON.parse(this._storage.getItem(hasUnreadNotificationsKey) || '{}');
        if (currentNotifications[networkId] && currentNotifications[networkId][account]) {
            return currentNotifications[networkId][account];
        }
        return false;
    }

    public saveLastBlockChecked(lastBlockChecked: number, account: string, networkId: number): void {
        const currentBlocks = JSON.parse(this._storage.getItem(lastBlockCheckedKey) || '{}');
        const newBlocks = {
            ...currentBlocks,
            [networkId]: {
                ...currentBlocks[networkId],
                [account]: lastBlockChecked,
            },
        };

        this._storage.setItem(lastBlockCheckedKey, JSON.stringify(newBlocks));
    }

    public getLastBlockChecked(account: string, networkId: number): number | null {
        const currentLastBlockChecked = JSON.parse(this._storage.getItem(lastBlockCheckedKey) || '{}');
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
