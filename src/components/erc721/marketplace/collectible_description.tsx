import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getCollectibleById } from '../../../store/selectors';
import { themeBreakPoints } from '../../../themes/commons';
import { truncateAddress } from '../../../util/number_utils';
import { convertTimeInSecondsToDaysAndHours } from '../../../util/time_utils';
import { Collectible, StoreState } from '../../../util/types';
import { Card } from '../../common/card';
import { OutsideUrlIcon } from '../../common/icons/outside_url_icon';
import { CustomTD, Table, TBody, TR } from '../../common/table';

const CollectibleDescriptionWrapper = styled.div``;

const CustomTDStyled = styled(CustomTD)`
    white-space: nowrap;
`;

const CollectibleDescriptionTitleWrapper = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 0 0 20px;
`;

const CollectibleDescriptionTitle = styled.h3`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0;
    padding: 0 15px 0 0;
`;

const CollectibleDescriptionType = styled.a`
    align-items: center;
    display: flex;
    text-decoration: none;
`;

const CollectibleDescriptionTypeText = styled.span`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0 6px;
`;

const CollectibleDescriptionTypeImage = styled.span<{ backgroundImage: string }>`
    background-image: url('${props => props.backgroundImage}');
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
    height: 16px;
    width: 16px;
`;

const CollectibleDescriptionInnerTitle = styled.h4`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0 0 10px;
`;

const CollectibleDescriptionText = styled.p`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 20px;

    &:last-child {
        margin: 0;
    }
`;

const CollectibleOwnerWrapper = styled.div`
    align-items: center;
    display: flex;
`;

const CollectibleOwnerImage = styled.span<{ backgroundImage: string }>`
    background-image: url('${props => props.backgroundImage}');
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
    height: 20px;
    margin: 0 8px 0 0;
    width: 20px;
`;

const CollectibleOwnerText = styled.p`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 14px;
    line-height: 1.2;
    margin: 0;
`;

const PriceChartContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    @media (min-width: ${themeBreakPoints.xl}) {
        flex-direction: row;
    }
`;

const PriceChartPriceAndTime = styled.div`
    margin-bottom: 25px;
    max-width: 150px;
    padding-right: 15px;
    padding-top: 25px;

    @media (min-width: ${themeBreakPoints.xl}) {
        margin-bottom: 0;
    }
`;

const PriceChartTitle = styled.h5`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
    margin: 0 0 6px;
`;

const PriceChartValue = styled.p`
    color: #00ae99;
    font-size: 14px;
    line-height: 1.2;
    margin: 0 0 35px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const PriceChartValueNeutral = styled(PriceChartValue)`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
`;

const PriceChartGraphWrapper = styled.div`
    flex-grow: 1;
    padding-bottom: 15px;

    @media (min-width: ${themeBreakPoints.xl}) {
        max-width: 365px;
    }
`;

const PriceChartGraph = styled.div`
    background-color: #f5f5f5;
    height: 148px;
    margin: 0 0 15px;
    width: 100%;
`;

const PriceChartGraphValues = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

const TransactionContainerTableWrapper = styled.div`
    overflow-x: auto;
    width: 100%;
`;

const arrowSVG = () => {
    return (
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M13.3536 4.35355C13.5488 4.15829 13.5488 3.84171 13.3536 3.64645L10.1716 0.464466C9.97631 0.269204 9.65973 0.269204 9.46447 0.464466C9.2692 0.659728 9.2692 0.976311 9.46447 1.17157L12.2929 4L9.46447 6.82843C9.2692 7.02369 9.2692 7.34027 9.46447 7.53553C9.65973 7.7308 9.97631 7.7308 10.1716 7.53553L13.3536 4.35355ZM0 4.5H13V3.5H0V4.5Z"
                fill="black"
            />
        </svg>
    );
};

interface OwnProps {
    collectibleId: string;
}

interface StateProps {
    collectible: Collectible | undefined;
}

type Props = OwnProps & StateProps;

const CollectibleDescription = (props: Props) => {
    const { collectible, ...restProps } = props;

    if (!collectible) {
        return null;
    }

    const { currentOwner, description, order, name, assetUrl } = collectible;
    const emptyPlaceholder = '----';
    const price = order ? order.takerAssetAmount : null;
    const tableTitlesStyling = { fontWeight: '500', color: '#0036f4' };
    const typeImage = 'https://placeimg.com/32/32/any';
    const ownerImage = 'https://placeimg.com/50/50/any';

    let timeRemaining = '';

    if (order && order.expirationTimeSeconds) {
        const daysAndHours = convertTimeInSecondsToDaysAndHours(order.expirationTimeSeconds);
        timeRemaining = `${daysAndHours.days} Days ${daysAndHours.hours} Hrs`;
    }

    return (
        <CollectibleDescriptionWrapper {...restProps}>
            <Card>
                <CollectibleDescriptionTitleWrapper>
                    <CollectibleDescriptionTitle>{name}</CollectibleDescriptionTitle>
                    <CollectibleDescriptionType href={assetUrl} target="_blank">
                        <CollectibleDescriptionTypeImage backgroundImage={typeImage} />
                        <CollectibleDescriptionTypeText>CryptoKitties</CollectibleDescriptionTypeText>
                        {OutsideUrlIcon()}
                    </CollectibleDescriptionType>
                </CollectibleDescriptionTitleWrapper>
                {description ? (
                    <>
                        <CollectibleDescriptionInnerTitle>Description</CollectibleDescriptionInnerTitle>
                        <CollectibleDescriptionText>{description}</CollectibleDescriptionText>
                    </>
                ) : null}
                {currentOwner ? (
                    <>
                        <CollectibleDescriptionInnerTitle>Current owner</CollectibleDescriptionInnerTitle>
                        <CollectibleOwnerWrapper>
                            <CollectibleOwnerImage backgroundImage={ownerImage} />
                            <CollectibleOwnerText>${truncateAddress(currentOwner)}</CollectibleOwnerText>
                        </CollectibleOwnerWrapper>
                    </>
                ) : null}
            </Card>
            <Card>
                <CollectibleDescriptionInnerTitle>Price Chart</CollectibleDescriptionInnerTitle>
                <PriceChartContainer>
                    <PriceChartPriceAndTime>
                        <PriceChartTitle>Current Price</PriceChartTitle>
                        <PriceChartValue>{price ? <p>{price.toString()} ETH</p> : emptyPlaceholder}</PriceChartValue>
                        <PriceChartTitle>Time Remaining</PriceChartTitle>
                        <PriceChartValue>{timeRemaining ? <p>{timeRemaining}</p> : emptyPlaceholder}</PriceChartValue>
                    </PriceChartPriceAndTime>
                    <PriceChartGraphWrapper>
                        <PriceChartGraph />
                        <PriceChartGraphValues>
                            <div>
                                <PriceChartTitle>Start Price</PriceChartTitle>
                                <PriceChartValueNeutral>5.00 ETH</PriceChartValueNeutral>
                            </div>
                            <div>
                                <PriceChartTitle>End Price</PriceChartTitle>
                                <PriceChartValueNeutral>3.00 ETH</PriceChartValueNeutral>
                            </div>
                        </PriceChartGraphValues>
                    </PriceChartGraphWrapper>
                </PriceChartContainer>
            </Card>
            <Card>
                <CollectibleDescriptionInnerTitle>Transaction history</CollectibleDescriptionInnerTitle>
                <TransactionContainerTableWrapper>
                    <Table>
                        <TBody>
                            <TR>
                                <CustomTDStyled styles={tableTitlesStyling}>Sold For</CustomTDStyled>
                                <CustomTDStyled>123.0234 ETH</CustomTDStyled>
                                <CustomTDStyled>Cryptokitties...</CustomTDStyled>
                                <CustomTDStyled>{arrowSVG()}</CustomTDStyled>
                                <CustomTDStyled>0xa49...322</CustomTDStyled>
                                <CustomTDStyled>2/3/19</CustomTDStyled>
                            </TR>
                            <TR>
                                <CustomTDStyled styles={tableTitlesStyling}>Listed at</CustomTDStyled>
                                <CustomTDStyled>0.41 ETH</CustomTDStyled>
                                <CustomTDStyled>0xa49...322...</CustomTDStyled>
                                <CustomTDStyled>{arrowSVG()}</CustomTDStyled>
                                <CustomTDStyled>Cryptokitties</CustomTDStyled>
                                <CustomTDStyled>2/3/19</CustomTDStyled>
                            </TR>
                            <TR>
                                <CustomTDStyled styles={tableTitlesStyling}>Transfer</CustomTDStyled>
                                <CustomTDStyled>--</CustomTDStyled>
                                <CustomTDStyled>Cryptokitties...</CustomTDStyled>
                                <CustomTDStyled>{arrowSVG()}</CustomTDStyled>
                                <CustomTDStyled>0xa49...322</CustomTDStyled>
                                <CustomTDStyled>2/3/19</CustomTDStyled>
                            </TR>
                            <TR>
                                <CustomTDStyled styles={tableTitlesStyling}>Created</CustomTDStyled>
                                <CustomTDStyled>--</CustomTDStyled>
                                <CustomTDStyled>Cryptokitties...</CustomTDStyled>
                                <CustomTDStyled>{arrowSVG()}</CustomTDStyled>
                                <CustomTDStyled>Cryptokitties</CustomTDStyled>
                                <CustomTDStyled>2/3/19</CustomTDStyled>
                            </TR>
                        </TBody>
                    </Table>
                </TransactionContainerTableWrapper>
            </Card>
        </CollectibleDescriptionWrapper>
    );
};

const mapStateToProps = (state: StoreState, props: OwnProps): StateProps => {
    return {
        collectible: getCollectibleById(state, props),
    };
};

const CollectibleDescriptionContainer = connect(mapStateToProps)(CollectibleDescription);

export { CollectibleDescription, CollectibleDescriptionContainer };
