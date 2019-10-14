import React from 'react';
import { Subtract } from 'utility-types';

interface WindowProps {
    windowWidth: number;
}

// tslint:disable-next-line: typedef
export function withWindowWidth<T extends WindowProps>(WrappedComponent: React.ComponentType<T>) {
    return class extends React.Component<Subtract<T, WindowProps>> {
        public state = { width: 0 };

        public componentDidMount = () => {
            this.updateWindowDimensions();
            window.addEventListener('resize', this.updateWindowDimensions);
        };

        public componentWillUnmount = () => {
            window.removeEventListener('resize', this.updateWindowDimensions);
        };

        public updateWindowDimensions = () => {
            if (window.innerWidth !== this.state.width) {
                this.setState({
                    width: window.innerWidth,
                });
            }
        };
        public render = () => {
            return <WrappedComponent {...(this.props as T)} windowWidth={this.state.width} />;
        };
    };
}
