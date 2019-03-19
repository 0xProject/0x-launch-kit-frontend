import React from 'react';
import TimeAgo from 'react-timeago';
import styled, { keyframes } from 'styled-components';

import { themeColors, themeDimensions } from '../../util/theme';
import { tokenAmountInUnits } from '../../util/tokens';
import { Notification, NotificationKind, OrderSide } from '../../util/types';
import { NotificationCancelIcon } from '../common/icons/notification_cancel_icon';
import { NotificationCheckmarkIcon } from '../common/icons/notification_checkmark_icon';
import { NotificationProcessingIcon } from '../common/icons/notification_processing_icon';

interface Props {
    item: Notification;
}

interface State {
    active: boolean;
    pending: boolean;
}

const NotificationWrapper = styled.div<{ active?: boolean }>`
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

class NotificationItem extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            active: false,
            pending: false,
        };
    }

    public componentDidMount = async () => {
        const { item } = this.props;

        if (item.kind === NotificationKind.Market) {
            this.setState({
                active: true,
                pending: true,
            });

            await item.tx.finally(() => this.setState({ pending: false }));
        }
    };

    public render = () => {
        const { item } = this.props;

        const title = this._getTitleFromItem(item);
        const text = this._getTextFromItem(item);

        return (
            <NotificationWrapper active={this.state.active}>
                <NotificationContent>
                    <NotificationTitle>{title}</NotificationTitle>
                    <NotificationText>{text}</NotificationText>
                </NotificationContent>
                <NotificationIcon>{this._getNotificationIcon(item)}</NotificationIcon>
            </NotificationWrapper>
        );
    };

    private readonly _getTitleFromItem = (item: Notification): string => {
        let operation: string;

        switch (item.kind) {
            case NotificationKind.Market:
                operation = item.side === OrderSide.Buy ? 'Market Buy' : 'Market Sell';
                break;
            case NotificationKind.CancelOrder:
                operation = 'Cancelled Order';
                break;
            case NotificationKind.Limit:
                operation = item.side === OrderSide.Buy ? 'Limit Buy' : 'Limit Sell';
                break;
            case NotificationKind.OrderFilled:
                operation = item.side === OrderSide.Buy ? 'Buy Order Filled' : 'Sell Order Filled';
                break;
            default: {
                const _exhaustiveCheck: never = item;
                operation = _exhaustiveCheck;
            }
        }

        const amount = tokenAmountInUnits(item.amount, item.token.decimals);
        return `${operation} ${amount} ${item.token.symbol.toUpperCase()}`;
    };

    private readonly _getTextFromItem = (item: Notification): React.ReactNode => {
        const formatter = (value: number, unit: string, suffix: string) => {
            if (unit === 'second') {
                return 'Just now';
            } else {
                return `${value}  ${unit}${value > 1 ? 's' : ''} ${suffix}`;
            }
        };

        return <TimeAgo date={item.timestamp} formatter={formatter} />;
    };

    private readonly _getNotificationIcon = (item: Notification) => {
        if (this.state.pending) {
            return (
                <NotificationIconSpin>
                    <NotificationProcessingIcon />
                </NotificationIconSpin>
            );
        } else if (item.kind === NotificationKind.CancelOrder) {
            return <NotificationCancelIcon />;
        } else {
            return <NotificationCheckmarkIcon />;
        }
    };
}

export { NotificationItem };
