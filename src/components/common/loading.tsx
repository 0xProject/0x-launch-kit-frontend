import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

export const Loading: React.FC = props => {
    return (
        <div {...props}>
            <FontAwesomeIcon icon="spinner" spin={true} />
        </div>
    );
};

const LoadingWrapper = styled.div`
    min-height: 200px;
    position: relative;
`;

const CenteredLoading = styled(Loading)`
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export const CardLoading: React.FC = () => (
    <LoadingWrapper>
        <CenteredLoading />
    </LoadingWrapper>
);
