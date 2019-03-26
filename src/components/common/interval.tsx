import React from 'react';

interface Props {
    delay: number;
    children: (now: Date) => React.ReactNode;
}

export class Interval extends React.Component<Props> {
    private _interval: any = null;

    public componentDidMount = () => {
        this._interval = setInterval(() => this.forceUpdate(), this.props.delay);
    };

    public componentWillUnmount = () => {
        if (this._interval) {
            clearInterval(this._interval);
        }
    };

    public render = () => {
        return this.props.children(new Date());
    };
}
