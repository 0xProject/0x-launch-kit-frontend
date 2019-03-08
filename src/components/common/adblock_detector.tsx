import React from 'react';

/* TODO -- This could be refactored using Hooks **/
class AdBlockDetector extends React.Component {
    public componentDidMount = async () => {
        const isAddBlockDetected = await this.detectAdBlock();
        if (isAddBlockDetected) {
            alert(
                'We detected you are using an ad blocker. Keep in mind that this dApp may not work correctly with it enabled',
            );
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

    public render = () => null;
}
export { AdBlockDetector };
