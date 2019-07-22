import React, { HTMLAttributes } from 'react';
import ReactSVG from 'react-svg';
import styled from 'styled-components';

const IconContainer = styled.div`
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    height: 50px;
    width: 50px;
    margin-top: auto;
`;

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const TorusLarge: React.FC<Props> = props => {
    const { ...restProps } = props;
    const Icon = <ReactSVG src={'assets/icons/torus_logo.svg'} />;
    return <IconContainer {...restProps}>{Icon}</IconContainer>;
};
