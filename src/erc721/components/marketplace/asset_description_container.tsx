import React from 'react';
import styled from 'styled-components';

import { Card } from '../../../components/common/card';
import { EmptyContent } from '../../../components/common/empty_content';
import { CustomTD, TR } from '../../../components/common/table';
import { truncateAddress } from '../../../util/number_utils';

import { TitleText } from './marketplace_common';

const DescriptionCard = styled(Card)`
    width: 586px;
    height: 218px;
`;

const DescriptionText = styled.p`
    color: #000;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5;
`;

export const AssetDescriptionContainer = (props: any) => {
    const assetOwner = '0x5409ed021d9299bf6814279a6a1411a7e866a631';
    const tableTitlesStyling = { color: '#0036f4', fontWeight: '500', lineWeight: '17px' };
    return (
        <>
            <DescriptionCard>
                <h2>Vulcat</h2>
                <TitleText>Description</TitleText>
                <DescriptionText>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                    laoreet dolore magna aliquam.
                </DescriptionText>
                <TitleText>Current owner</TitleText>
                <DescriptionText>{assetOwner ? `${truncateAddress(assetOwner)}` : ''}</DescriptionText>
            </DescriptionCard>
            <DescriptionCard>
                <TitleText>Price Chart</TitleText>
                <TitleText>Current price</TitleText>
                <p>4.4 ETH</p>
                <TitleText>Time remaining</TitleText>
                <p>2 Days 8 hrs</p>
            </DescriptionCard>
            <DescriptionCard>
                <TitleText>Transaction history</TitleText>
                <table>
                    <tbody>
                        <TR>
                            <CustomTD styles={tableTitlesStyling}>Sold For</CustomTD>
                            <CustomTD>123.0234 ETH</CustomTD>
                            <CustomTD>Cryptokitties... =></CustomTD>
                            <CustomTD>0xa49...322</CustomTD>
                            <CustomTD>2/3/19</CustomTD>
                        </TR>
                        <TR>
                            <CustomTD styles={tableTitlesStyling}>Listed at</CustomTD>
                            <CustomTD>0.41 ETH</CustomTD>
                            <CustomTD>0xa49...322... =></CustomTD>
                            <CustomTD>Cryptokitties</CustomTD>
                            <CustomTD>2/3/19</CustomTD>
                        </TR>
                        <TR>
                            <CustomTD styles={tableTitlesStyling}>Transfer</CustomTD>
                            <EmptyContent text={''} />
                            <CustomTD>Cryptokitties... =></CustomTD>
                            <CustomTD>0xa49...322</CustomTD>
                            <CustomTD>2/3/19</CustomTD>
                        </TR>
                        <TR>
                            <CustomTD styles={tableTitlesStyling}>Created</CustomTD>
                            <EmptyContent text={''} />
                            <CustomTD>Cryptokitties... =></CustomTD>
                            <CustomTD>Cryptokitties</CustomTD>
                            <CustomTD>2/3/19</CustomTD>
                        </TR>
                    </tbody>
                </table>
            </DescriptionCard>
        </>
    );
};
