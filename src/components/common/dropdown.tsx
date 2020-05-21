import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

export enum DropdownPositions {
    Center,
    Left,
    Right,
}

interface DropdownWrapperBodyProps {
    horizontalPosition?: DropdownPositions;
}

interface Props extends HTMLAttributes<HTMLDivElement>, DropdownWrapperBodyProps {
    body: React.ReactNode;
    header: React.ReactNode;
    shouldCloseDropdownOnClickOutside?: boolean;
}

const DropdownWrapper = styled.div`
    position: relative;
`;

const DropdownWrapperHeader = styled.div`
    cursor: pointer;
    position: relative;
`;

const DropdownWrapperBody = styled.div<DropdownWrapperBodyProps>`
    position: absolute;
    top: calc(100% + 15px);

    ${props => (props.horizontalPosition === DropdownPositions.Left ? 'left: 0;' : '')}

    ${props => (props.horizontalPosition === DropdownPositions.Center ? 'left: 50%; transform: translateX(-50%);' : '')}

    ${props => (props.horizontalPosition === DropdownPositions.Right ? 'right: 0;' : '')}
`;

interface State {
    isOpen: boolean;
}

export class Dropdown extends React.Component<Props, State> {
    public readonly state: State = {
        isOpen: false,
    };
    private _wrapperRef: any;

    public render = () => {
        const { header, body, horizontalPosition = DropdownPositions.Left, ...restProps } = this.props;

        return (
            <DropdownWrapper ref={this._setWrapperRef} {...restProps}>
                <DropdownWrapperHeader onClick={this._toggleDropdown}>{header}</DropdownWrapperHeader>
                {this.state.isOpen ? (
                    <DropdownWrapperBody horizontalPosition={horizontalPosition} onClick={this._closeDropdownBody}>
                        {body}
                    </DropdownWrapperBody>
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

    public closeDropdown = () => {
        this.setState({ isOpen: false });
    };

    private readonly _setWrapperRef = (node: any) => {
        this._wrapperRef = node;
    };

    private readonly _handleClickOutside = (event: any) => {
        const { shouldCloseDropdownOnClickOutside = true } = this.props;
        if (this._wrapperRef && !this._wrapperRef.contains(event.target)) {
            if (shouldCloseDropdownOnClickOutside) {
                this.closeDropdown();
            }
        }
    };

    private readonly _toggleDropdown = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    private readonly _closeDropdownBody = () => {
        const { shouldCloseDropdownOnClickOutside = true } = this.props;
        if (shouldCloseDropdownOnClickOutside) {
            this.closeDropdown();
        }
    };
}
