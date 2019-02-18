import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

export const Loading: React.FC = props => {
    return (
        <div className="loading-indicator" {...props}>
            <FontAwesomeIcon icon="spinner" spin={true} />
        </div>
    );
};

const LoadingWrapper = styled.div`
    position: relative;
    min-height: 5rem;
`;

const CenteredLoading = styled(Loading)`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export const CardLoading: React.FC = () => (
    <LoadingWrapper>
        <CenteredLoading />
    </LoadingWrapper>
);
