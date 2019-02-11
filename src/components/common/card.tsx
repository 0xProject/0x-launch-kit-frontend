import React from 'react';
import styled from 'styled-components';

interface Props {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const headerHeight = 70;

const CardHeader = styled.div`
    margin: 0;
    padding: 0 15px;
    height: ${headerHeight}px;

    border-bottom: 1px solid #dedede;
`;

const CardTitle = styled.h1`
    display: inline-block;
    margin: 0;

    font-style: normal;
    font-weight: bold;
    line-height: ${headerHeight}px;
    font-size: 16px;
`;

const CardAction = styled.div`
    float: right;

    line-height: ${headerHeight}px;
`;

const CardBody = styled.div`
    margin: 0;
    padding: 18px 15px;
`;

const CardWrapper = styled.div`
    background-color: white;
    border: 1px solid #dedede;
    border-radius: 4px;
    margin-bottom: 1.5rem;
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
