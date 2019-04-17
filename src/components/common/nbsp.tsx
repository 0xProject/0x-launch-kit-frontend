import React from 'react';

export class Nbsp extends React.Component<{}, {}> {
    // See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544
    public render = () => {
        return <>{'\u00A0'}</>;
    };
}
