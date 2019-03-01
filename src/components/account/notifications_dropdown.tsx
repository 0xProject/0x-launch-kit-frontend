import React, { HTMLAttributes } from 'react';
import styled, { keyframes } from 'styled-components';

import { themeColors, themeDimensions } from '../../util/theme';
import { CardBase } from '../common/card_base';
import { Dropdown, DropdownPositions } from '../common/dropdown';
import { BellIcon } from '../common/icons/bell_icon';
import { NotificationCancelIcon } from '../common/icons/notification_cancel_icon';
import { NotificationCheckmarkIcon } from '../common/icons/notification_checkmark_icon';
import { NotificationProcessingIcon } from '../common/icons/notification_processing_icon';
import { Loading } from '../common/loading';

interface Props extends HTMLAttributes<HTMLDivElement> {}

interface State {
    isLoadingNotifications: boolean;
    newNotifications: boolean;
}

enum NotificationsStatus {
    Processing,
    Success,
    Cancel,
}

const NotificationsDropdownWrapper = styled(Dropdown)``;

const NotificationsDropdownHeader = styled.div`
    align-items: center;
    display: flex;
    position: relative;
`;

const NewNotificationsBadge = styled.div`
    background: #ff6534;
    border-radius: 50%;
    height: 7px;
    position: absolute;
    right: -4px;
    top: 12px;
    width: 7px;
`;

const NotificationsDropdownBody = styled(CardBase)`
    width: 400px;
`;
const NotificationsList = styled.div`
    height: 420px;
    overflow: auto;
`;

const NotificationItem = styled.div<{ active?: boolean }>`
    align-items: center;
    background-color: ${props => (props.active ? themeColors.rowActive : 'transparent')};
    border-bottom: 1px solid ${themeColors.borderColor};
    display: flex;
    justify-content: space-between;
    padding: 20px ${themeDimensions.horizontalPadding};

    &:last-child {
        border-bottom: none;
    }
`;

const NotificationContent = styled.div`
    flex-grow: 1;
    padding-right: 25px;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const NotificationIconSpin = styled.div`
    animation: ${rotate} 1.5s linear infinite;
`;

const NotificationIcon = styled.div`
    flex-shrink: 0;
`;

const NotificationDropdownTitle = styled.h1`
    border-bottom: 1px solid ${themeColors.borderColor};
    color: #000;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0;
    padding: 15px ${themeDimensions.horizontalPadding};
`;

const NotificationTitle = styled.h2`
    color: #000;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 8px;
`;

const NotificationText = styled.p`
    color: ${themeColors.textLight};
    font-size: 16px;
    font-weight: 400;
    line-height: 1.2;
    margin: 0;
`;

const LoadingStyled = styled(Loading)`
    left: 50%;
    min-height: 0;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
`;

const NOTIFICATIONS_LIST = [
    {
        status: NotificationsStatus.Processing,
        text: '00:15  (Est. 45 seconds)',
        time: 45000,
        title: 'Limit Buy 200.5 ZRX',
    },
    {
        status: NotificationsStatus.Cancel,
        text: '9 days ago',
        title: 'Cancelled Order 15.33 REP',
    },
    {
        status: NotificationsStatus.Success,
        text: '4 minutes ago',
        title: 'Market Sell 12 wETH',
    },
    {
        status: NotificationsStatus.Cancel,
        text: '9 days ago',
        title: 'Cancelled Order 15.33 REP',
    },
    {
        status: NotificationsStatus.Success,
        text: '4 minutes ago',
        title: 'Market Sell 12 wETH',
    },
    {
        status: NotificationsStatus.Cancel,
        text: '9 days ago',
        title: 'Cancelled Order 15.33 REP',
    },
    {
        status: NotificationsStatus.Success,
        text: '4 minutes ago',
        title: 'Market Sell 12 wETH',
    },
    {
        status: NotificationsStatus.Cancel,
        text: '9 days ago',
        title: 'Cancelled Order 15.33 REP',
    },
    {
        status: NotificationsStatus.Success,
        text: '4 minutes ago',
        title: 'Market Sell 12 wETH',
    },
];

class NotificationsDropdown extends React.Component<Props, State> {
    public readonly state: State = {
        isLoadingNotifications: true,
        newNotifications: true,
    };

    public render = () => {
        const { ...restProps } = this.props;

        const notificationsList = NOTIFICATIONS_LIST.map((item, index) => (
            <NotificationItem key={index} active={item.status === NotificationsStatus.Processing}>
                <NotificationContent>
                    <NotificationTitle>{item.title}</NotificationTitle>
                    <NotificationText>{item.text}</NotificationText>
                </NotificationContent>
                <NotificationIcon>{this._getNotificationIcon(item.status)}</NotificationIcon>
            </NotificationItem>
        ));

        const header = (
            <NotificationsDropdownHeader>
                <BellIcon />
                {this.state.newNotifications ? <NewNotificationsBadge /> : null}
            </NotificationsDropdownHeader>
        );

        const body = (
            <NotificationsDropdownBody>
                <NotificationDropdownTitle>Notifications</NotificationDropdownTitle>
                <NotificationsList>
                    {this.state.isLoadingNotifications ? <LoadingStyled /> : notificationsList}
                </NotificationsList>
            </NotificationsDropdownBody>
        );

        return (
            <NotificationsDropdownWrapper
                body={body}
                header={header}
                horizontalPosition={DropdownPositions.Right}
                onClick={this._loadNotifications}
                shouldCloseDropdownBodyOnClick={false}
                {...restProps}
            />
        );
    };

    private readonly _getNotificationIcon = (status: NotificationsStatus) => {
        if (status === NotificationsStatus.Cancel) {
            return <NotificationCancelIcon />;
        } else if (status === NotificationsStatus.Success) {
            return <NotificationCheckmarkIcon />;
        }

        return (
            <NotificationIconSpin>
                <NotificationProcessingIcon />
            </NotificationIconSpin>
        );
    };

    private readonly _loadNotifications = () => {
        this.setState({ newNotifications: false });

        // This is only for showing the 'loading' component, delete ASAP
        setTimeout(() => {
            this.setState({ isLoadingNotifications: false });
        }, 1000);
    };
}

export { NotificationsDropdown };
