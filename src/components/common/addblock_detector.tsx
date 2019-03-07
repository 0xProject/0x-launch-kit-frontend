import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLButtonElement> {}

interface State {}

class AddBlockDetector extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    public componentDidMount = async () => {
        const addBlockDetected = await this.detectAddBlock();
        if (addBlockDetected) {
            alert('Ad-Block DETECTED, please disable it in order to use our dApp!');
            window.location.reload();
        }
    };

    public detectAddBlock = () => {
        return new Promise((resolve, reject) => {
            /* Creates a bait for adblock **/
            const elem = document.createElement('div');
            elem.className = 'adclass';
            document.body.appendChild(elem);
            let addBlockDetected;
            window.setTimeout(() => {
                addBlockDetected = !(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
                resolve(addBlockDetected);
            }, 0);
        });
    };

    public render = () => {
        const { children } = this.props;
        return children;
    };
}
export { AddBlockDetector };
