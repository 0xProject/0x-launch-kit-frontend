import React from 'react';

interface EmojiProps {
    label: string;
    symbol: string;
}

export const Emoji = (props: EmojiProps) => (
    <span role="img" aria-label={props.label ? props.label : ''} aria-hidden={props.label ? 'false' : 'true'}>
        {props.symbol}
    </span>
);
