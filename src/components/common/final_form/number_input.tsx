import React from 'react';
import { FieldRenderProps } from 'react-final-form';

type Props = FieldRenderProps<number, any>;

export const NumberInput: React.FC<Props> = ({ input, meta, ...rest }: Props) => (
    <input {...input} {...rest} type="number" />
);
