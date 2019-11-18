import React from 'react';
import styled from 'styled-components';

const LoadingText = styled.p`
    color: white;
`;
const Ball = styled.div`
    color: white;
`;

export const PageLoading = ({ text = 'Veridex Loading ...' }) => (
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
                <strong> {text}</strong>{' '}
            </LoadingText>
        </div>
    </div>
);
