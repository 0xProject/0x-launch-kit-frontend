import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeDimensions } from '../../util/theme';

interface Props extends HTMLAttributes<HTMLDivElement> {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}

const borderColor = '#DEDEDE';

const CardWrapper = styled.div`
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid ${borderColor};
    margin-bottom: 30px;
`;

const CardHeader = styled.div`
    align-items: center;
    border-bottom: 1px solid ${borderColor};
    display: flex;
    justify-content: space-between;
    padding: 15px ${themeDimensions.horizontalPadding};
`;

const CardTitle = styled.h1`
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 1.2;
    margin: 0;
    padding: 0 20px 0 0;
`;

const CardAction = styled.div`
    color: #b9b9b9;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
`;

const CardBody = styled.div`
    margin: 0;
    min-height: 140px;
    overflow-x: auto;
    padding: ${themeDimensions.verticalPadding} ${themeDimensions.horizontalPadding};
`;

export const Card: React.FC<Props> = props => {
    const { title, action, children, ...restProps } = props;

    return (
        <CardWrapper {...restProps}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {action ? <CardAction>{action}</CardAction> : null}
            </CardHeader>
            <CardBody>{children}</CardBody>
        </CardWrapper>
    );
};
