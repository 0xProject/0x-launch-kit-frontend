import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {}

interface State {}

class AdBlockDetector extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    public componentDidMount = async () => {
        const isAddBlockDetected = await this.detectAdBlock();
        if (isAddBlockDetected) {
            alert('Ad-Block DETECTED, please disable it in order to use our dApp!');
            window.location.reload();
        }
    };

    public detectAdBlock = () => {
        return new Promise<boolean>((resolve, reject) => {
            /* Creates a bait for ad block **/
            const elem = document.createElement('div');
            elem.className = 'adclass';
            document.body.appendChild(elem);
            let isAdBlockDetected;
            window.setTimeout(() => {
                isAdBlockDetected = !(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
                resolve(isAdBlockDetected);
            }, 0);
        });
    };

    public render = () => {
        const { children } = this.props;
        return children;
    };
}
export { AdBlockDetector };
