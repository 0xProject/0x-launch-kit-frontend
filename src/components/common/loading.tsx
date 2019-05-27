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

const LoadingContainer = styled.div<Props>`
    ${props => `min-height: ${props.minHeight}`};
    position: relative;
`;

LoadingContainer.defaultProps = {
    minHeight: '200px',
};

const CenteredLoading = styled(Loading)`
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export const LoadingWrapper: React.FC<Props> = props => {
    const { ...restProps } = props;

    return (
        <LoadingContainer {...restProps}>
            <CenteredLoading />
        </LoadingContainer>
    );
};
