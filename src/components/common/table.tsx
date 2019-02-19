import styled from 'styled-components';

export const THead = styled.thead`
    text-transform: uppercase;
    color: #ccc;
    font-size: 12px;
`;

export const Table = styled.table`
    width: 100%;
`;

export const TR = styled.tr``;

export const TH = styled.th`
    color: #b9b9b9;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: 1.2;
    padding: 0 10px 5px 0;
    text-align: left;
    text-transform: uppercase;

    &:last-child {
        padding-right: 0;
    }
`;

export const CustomTD = styled.td`
    font-size: 14px;
    font-weight: normal;
    line-height: 1.2;
    padding: 5px 10px 5px 0;

    &:last-child {
        padding-right: 0;
    }
`;
