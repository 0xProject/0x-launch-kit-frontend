import React from 'react';
import { ColorResult, TwitterPicker } from 'react-color';
import { FieldRenderProps } from 'react-final-form';
// tslint:disable-next-line: typedef
export function ColorInput<T extends string>({ input, meta, ...rest }: FieldRenderProps<T, any>) {
    const onChange = (colorResult: ColorResult) => input.onChange(colorResult.hex);
    return <TwitterPicker color={input.value} onChange={onChange} />;
}
