import React, { HTMLAttributes, useRef, useState } from 'react';
import styled from 'styled-components';

import { themeDimensions } from '../../themes/commons';

import { Chevron } from './icons/chevron_icon';

const AccordionSection = styled.div`
    display: flex;
    flex-direction: column;
`;

const AccordionButton = styled.div<{ active?: boolean }>`
    background-color: ${props => (props.active ? '#ccc' : '#eee')};
    color: #444;
    cursor: pointer;
    padding: 12px;
    display: flex;
    align-items: center;
    border: none;
    outline: none;
    transition: background-color 0.6s ease;
    :hover {
        background-color: #ccc;
    }
`;
/* Style the accordion content title */

const AccordionTitle = styled.p`
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
`;

const AccordionText = styled.div`
    background-color: ${props => props.theme.componentsTheme.cardBackgroundColor};
    overflow: hidden;
    transition: max-height 0.6s ease;
    padding-left: 10px;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
`;

const AccordionContent = styled.div`
    background-color: ${props => props.theme.componentsTheme.cardBackgroundColor};
    overflow: hidden;
    transition: max-height 0.6s ease;
`;

const ChevronContainer = styled.div<{ isRotate: boolean }>`
    margin-left: auto;
    transition: transform 0.6s ease;
    transform: 'rotate(0deg)';
    transform: ${props => (props.isRotate ? 'rotate(90deg)' : '')};
`;

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    isOpen?: boolean;
}

export const Accordion = (props: Props) => {
    const { children, title, isOpen = false, ...restProps } = props;

    const [isActive, setActiveState] = useState(isOpen);
    const [setHeight, setHeightState] = useState(isOpen ? '100%' : '0px');
    const [isRotate, setRotateState] = useState(isOpen ? true : false);

    const content = useRef(null);

    const toggleAccordion = () => {
        setActiveState(isActive ? false : true);
        setHeightState(
            // @ts-ignore
            isActive ? '0px' : `${content && content.current.scrollHeight}px`,
        );
        setRotateState(isActive ? false : true);
    };

    return (
        <AccordionSection {...restProps}>
            <AccordionButton active={isActive} onClick={toggleAccordion}>
                <AccordionTitle>{title}</AccordionTitle>
                <ChevronContainer isRotate={isRotate}>
                    <Chevron width={10} fill={'777'} />
                </ChevronContainer>
            </AccordionButton>
            <AccordionContent ref={content} style={{ maxHeight: `${setHeight}` }}>
                <AccordionText>{children}</AccordionText>
            </AccordionContent>
        </AccordionSection>
    );
};
