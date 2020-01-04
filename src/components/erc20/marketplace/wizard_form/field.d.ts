declare module 'react-final-form-listeners';
declare module 'react-final-form-html5-validation';

/*declare module 'react-final-form-html5-validation' {
    import { ComponentType } from 'react';
    import { FieldProps } from 'react-final-form';

    interface Props {
        max?: number;
        maxLength?: number;
        min?: number;
        minLength?: number;
        pattern?: string;
        required?: boolean;
        step?: number;
    }

    type MessageValue = string | ((value: any, props: Props) => string);

    interface Messages {
        badInput?: MessageValue;
        patternMismatch?: MessageValue;
        rangeOverflow?: MessageValue;
        rangeUnderflow?: MessageValue;
        stepMismatch?: MessageValue;
        tooLong?: MessageValue;
        tooShort?: MessageValue;
        typeMismatch?: MessageValue;
        valueMissing?: MessageValue;
    }

    export type Html5ValidationFieldProps<FieldValue = any, T extends HTMLElement = any> = FieldProps<
        FieldValue,
        HTMLElement
    > &
        Messages;

    export const Field: ComponentType<Html5ValidationFieldProps>;
}
declare module 'react-final-form-listeners';
*/
