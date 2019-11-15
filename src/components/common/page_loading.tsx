import React from 'react';
import styled from 'styled-components';

const LoadingText = styled.p`
    color: white;
`;
const Ball = styled.div`
    color: white;
`;

export const PageLoading = () => (
    <div className="black-overlay">
        <Ball className="la-ball-square-clockwise-spin la-2x">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
        </Ball>
        <div className="loading-text">
            <LoadingText>
                <strong> VeriDex Loading...</strong>{' '}
            </LoadingText>
        </div>
    </div>
);
