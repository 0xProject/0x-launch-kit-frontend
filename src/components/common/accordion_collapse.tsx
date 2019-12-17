import React, { HTMLAttributes, useState } from 'react';
import { Collapse } from 'react-collapse';
import styled from 'styled-components';

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

const ChevronContainer = styled.div<{ isRotate: boolean }>`
    margin-left: auto;
    transition: transform 0.6s ease;
    transform: 'rotate(0deg)';
    transform: ${props => (props.isRotate ? 'rotate(90deg)' : '')};
`;

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    isOpen?: boolean;
    setIsOpen?: boolean;
}

export const AccordionCollapse = (props: Props) => {
    const { children, title, isOpen = false, setIsOpen, ...restProps } = props;

    const [isActive, setActiveState] = useState(isOpen);
    const [isRotate, setRotateState] = useState(isOpen ? true : false);

    const toggleAccordion = () => {
        setActiveState(isActive ? false : true);
        setRotateState(isActive ? false : true);
    };
    // externally set collapse
    if (setIsOpen && !isActive) {
        setActiveState(true);
        setRotateState(true);
    }

    return (
        <AccordionSection {...restProps}>
            <AccordionButton active={isActive} onClick={toggleAccordion}>
                <AccordionTitle>{title}</AccordionTitle>
                <ChevronContainer isRotate={isRotate}>
                    <Chevron width={10} fill={'777'} />
                </ChevronContainer>
            </AccordionButton>
            <Collapse isOpened={isActive}>{children}</Collapse>
        </AccordionSection>
    );
};
