import React, { Component } from 'react';
import styled from 'styled-components';

const SearchIcon = styled.div`
    padding: 10px 10px;
    height: 52px;
    position: relative;
    &:before {
        content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAQJJREFUKBWVkr2uQUEUhf3ET6GRaC5aFRoJKrf1BKpb8SwqovYGXkCj00k0QnRKEYkILYobvpUYmeMMyVnJl7P3mjN7Zu9zwiGv2qRFyMMSRrAFp6JPN8XzBj+wgDkUYAg7WINTYdwpDECxrRLJHeq2accdkgm8bzTvNAg2EDOGeUYI1KNO1gkuzTA1g8T7ojbn4ONQWPuHPWgeHmnzCqoe15tkSNPgPEAn68oVcOmA2XMtGK9FoE/VhOTTVNExqLCGZnxCv2pYauEC6lF0oQxX6IOvb7yX9NPEQafan+aPXDdQC18LsO6Tip5BBY6gIQaSbnMCFRCBZRcIvFkbsvCr4AFGOCxQy+JdGQAAAABJRU5ErkJggg==');
        display: block;
        position: absolute;
        font-size: 20px;
        line-height: 32px;
        left: 12px;
        width: 10px;
        height: 10px;
        padding-left: 10px;
    }
`;

const SearchInput = styled.input`
    background-color: #f9fafc;
    text-align: center;
    border: 1px solid #eaeaea;
    box-sizing: border-box;
    border-radius: 4px;
    width: 468px;
    height: 32px;

    ::placeholder {
        position: absolute;
        left: 36.07%;
        right: 17.36%;
        top: 25%;
        bottom: 9.38%;
        font-family: Inter UI;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 21px;
        font-feature-settings: 'tnum' on, 'onum' on;
    }
`;

export class Search extends Component {
    public render = () => {
        const { ...restProps } = this.props;
        return (
            <SearchIcon>
                <SearchInput {...restProps} placeholder={'Search Cryptocards'} />
            </SearchIcon>
        );
    };
}
