import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {
    body: React.ReactNode;
    header: React.ReactNode;
    shouldCloseDropdownBodyOnClick?: boolean;
}

const DropdownWrapper = styled.div`
    position: relative;
`;

const DropdownWrapperHeader = styled.div`
    cursor: pointer;
    position: relative;
`;

const DropdownWrapperBody = styled.div`
    position: absolute;
    top: calc(100% + 10px);
`;

interface State {
    isOpen: boolean;
}

export class Dropdown extends React.Component<Props, State> {
    private _wrapperRef: any;

    public readonly state: State = {
        isOpen: false,
    };

    public render = () => {
        const { header, body } = this.props;

        return (
            <DropdownWrapper ref={this._setWrapperRef}>
                <DropdownWrapperHeader onClick={this._toggleDropwdown}>{header}</DropdownWrapperHeader>
                {this.state.isOpen ? (
                    <DropdownWrapperBody onClick={this._closeDropwdownBody}>{body}</DropdownWrapperBody>
                ) : null}
            </DropdownWrapper>
        );
    };

    public componentDidMount = () => {
        document.addEventListener('mousedown', this._handleClickOutside);
    };

    public componentWillUnmount = () => {
        document.removeEventListener('mousedown', this._handleClickOutside);
    };

    private readonly _setWrapperRef = (node: any) => {
        this._wrapperRef = node;
    };

    private readonly _handleClickOutside = (event: any) => {
        if (this._wrapperRef && !this._wrapperRef.contains(event.target)) {
            this._closeDropdown();
        }
    };

    private readonly _closeDropdown = () => {
        this.setState({ isOpen: false });
    };

    private readonly _toggleDropwdown = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    private readonly _closeDropwdownBody = () => {
        const { shouldCloseDropdownBodyOnClick = true } = this.props;

        if (shouldCloseDropdownBodyOnClick) {
            this._closeDropdown();
        }
    };
}
