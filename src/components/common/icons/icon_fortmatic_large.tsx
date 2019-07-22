import React, { HTMLAttributes } from 'react';
import ReactSVG from 'react-svg';
import styled from 'styled-components';

const IconContainer = styled.div`
    background-position: 0% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    height: 82px;
    width: 104px;
    margin-top: auto;
`;

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const FortmaticLarge: React.FC<Props> = props => {
    const { ...restProps } = props;
    const Icon = <ReactSVG src={'assets/icons/fortmatic_logo.svg'} />;
    return <IconContainer {...restProps}>{Icon}</IconContainer>;
};
