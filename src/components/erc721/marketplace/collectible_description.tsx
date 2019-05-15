import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getCollectibleById } from '../../../store/selectors';
import { truncateAddress } from '../../../util/number_utils';
import { Collectible, StoreState } from '../../../util/types';
import { Card } from '../../common/card';
import { OutsideUrlIcon } from '../../common/icons/outside_url_icon';
import { CustomTD, TR } from '../../common/table';

import { TitleText } from './marketplace_common';

const CollectibleDescriptionWrapper = styled.div``;

const DescriptionCard = styled(Card)``;

const DescriptionText = styled.p`
    color: #000;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5;
`;

const CollectibleNameTitleWrapper = styled.div`
    align-items: center;
    display: flex;
    flex-shrink: 0;
    height: 22px;
    justify-content: space-between;
    margin-top: 16px;
    padding: 0 0 8px 0;
`;

const CollectibleNameTitle = styled.h3`
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
`;

const CollectibleTypeTitle = styled(TitleText)`
    :before {
        content: url(''); // TODO add ASSET TYPE icon url
    }
`;

const IconWrapper = styled.a`
    height: 12px;
    margin-left: 6px;
    width: 12px;
`;

interface OwnProps {
    assetId: string;
}

interface StateProps {
    asset: Collectible | undefined;
}

type Props = OwnProps & StateProps;

const CollectibleDescription = (props: Props) => {
    const { asset } = props;
    if (!asset) {
        return null;
    }
    const { currentOwner, description, order, name, assetUrl } = asset;

    const price = order ? order.takerAssetAmount : null;
    const tableTitlesStyling = { color: '#0036f4', fontWeight: '500', lineWeight: '17px' };

    return (
        <CollectibleDescriptionWrapper>
            <DescriptionCard>
                <CollectibleNameTitleWrapper>
                    <CollectibleNameTitle>{name}</CollectibleNameTitle>
                    <CollectibleTypeTitle>
                        CryptoKitties
                        <IconWrapper href={assetUrl} target="_blank">
                            {OutsideUrlIcon()}
                        </IconWrapper>
                    </CollectibleTypeTitle>
                </CollectibleNameTitleWrapper>

                <TitleText>Description</TitleText>
                <DescriptionText>{description}</DescriptionText>
                <TitleText>Current owner</TitleText>
                <DescriptionText>{currentOwner ? `${truncateAddress(currentOwner)}` : ''}</DescriptionText>
            </DescriptionCard>
            <DescriptionCard>
                <TitleText>Price Chart</TitleText>
                <TitleText>Current price</TitleText>
                {price ? <p>{price.toString()} ETH</p> : '----'}
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
                            <CustomTD />
                            <CustomTD>Cryptokitties... =></CustomTD>
                            <CustomTD>0xa49...322</CustomTD>
                            <CustomTD>2/3/19</CustomTD>
                        </TR>
                        <TR>
                            <CustomTD styles={tableTitlesStyling}>Created</CustomTD>
                            <CustomTD />
                            <CustomTD>Cryptokitties... =></CustomTD>
                            <CustomTD>Cryptokitties</CustomTD>
                            <CustomTD>2/3/19</CustomTD>
                        </TR>
                    </tbody>
                </table>
            </DescriptionCard>
        </CollectibleDescriptionWrapper>
    );
};

const mapStateToProps = (state: StoreState, props: OwnProps): StateProps => {
    return {
        asset: getCollectibleById(state, props),
    };
};

const CollectibleDescriptionContainer = connect(mapStateToProps)(CollectibleDescription);

export { CollectibleDescription, CollectibleDescriptionContainer };
