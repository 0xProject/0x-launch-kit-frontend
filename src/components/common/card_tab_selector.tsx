import React, { HTMLAttributes } from 'react';
// import styled from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {
    tabs: any;
}

export const TabSelector: React.FC<Props> = props => {
    // const { tabs } = props;
    return null;
    // return (
    //     <span>
    //         {tabs.map((item, index) => {

    //         })}
    //         {/* <span onClick={setTabOpen} style={{ color: this.state.tab === Tab.Open ? 'black' : '#ccc' }}>
    //         Open
    //     </span>
    //     &nbsp;/&nbsp;
    //     <span onClick={setTabFilled} style={{ color: this.state.tab === Tab.Filled ? 'black' : '#ccc' }}>
    //         Filled
    //     </span> */}
    //     </span>)
};
