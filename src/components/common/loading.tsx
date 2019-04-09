import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { Spinner } from './spinner';

interface Props extends HTMLAttributes<HTMLDivElement> {
    minHeight?: string;
}

export const Loading: React.FC = props => {
    return (
        <div {...props}>
            <Spinner />
        </div>
    );
};

const LoadingWrapper = styled.div<Props>`
    ${props => `min-height: ${props.minHeight ? props.minHeight : '200px'}`};
    position: relative;
`;

const CenteredLoading = styled(Loading)`
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export const CardLoading: React.FC<Props> = props => {
    const { ...restProps } = props;

    return (
        <LoadingWrapper {...restProps}>
            <CenteredLoading />
        </LoadingWrapper>
    );
};
