import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    title: string;
}

const CardTitle = styled.h1`
    margin: 0;
    padding: 15px;

    font-style: normal;
    font-weight: bold;
    line-height: normal;
    font-size: 16px;

    border-bottom: 1px solid #dedede;
`;

const CardBody = styled.div`
    margin: 0;
    padding: 18px 15px;
`;

const CardWrapper = styled.div`
    background-color: white;
    border: 1px solid #dedede;
    border-radius: 4px;
`;

export const Card: React.FC<Props> = props => {
    const { title, children, ...restProps } = props;

    return (
        <CardWrapper {...restProps}>
            <CardTitle>{title}</CardTitle>
            <CardBody>{children}</CardBody>
        </CardWrapper>
    );
};
