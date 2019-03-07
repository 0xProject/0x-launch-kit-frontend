import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {}

interface State {}

class AddBlockDetector extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    public componentDidMount = async () => {
        const isAddBlockDetected = await this.detectAddBlock();
        if (isAddBlockDetected) {
            alert('Ad-Block DETECTED, please disable it in order to use our dApp!');
            window.location.reload();
        }
    };

    public detectAddBlock = () => {
        return new Promise<boolean>((resolve, reject) => {
            /* Creates a bait for ad block **/
            const elem = document.createElement('div');
            elem.className = 'adclass';
            document.body.appendChild(elem);
            let isAddBlockDetected;
            window.setTimeout(() => {
                isAddBlockDetected = !(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
                resolve(isAddBlockDetected);
            }, 0);
        });
    };

    public render = () => {
        const { children } = this.props;
        return children;
    };
}
export { AddBlockDetector };
