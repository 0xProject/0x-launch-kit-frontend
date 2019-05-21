import { BigNumber } from '0x.js';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import styled from 'styled-components';

import { ETH_DECIMALS } from '../../../common/constants';
import { themeBreakPoints } from '../../../themes/commons';
import { getCollectiblePrice } from '../../../util/collectibles';
import { getDutchAuctionData, isDutchAuction } from '../../../util/orders';
import { convertTimeInSecondsToDaysAndHours } from '../../../util/time_utils';
import { tokenAmountInUnits } from '../../../util/tokens';
import { Collectible } from '../../../util/types';
import { Card } from '../../common/card';

import { CollectibleDescriptionInnerTitle } from './collectible_description';

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

export const PriceChartTitle = styled.h5`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
    margin: 0 0 6px;
`;

export const PriceChartValue = styled.p`
    color: #00ae99;
    font-feature-settings: 'calt' 0;
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

interface Props {
    collectible: Collectible;
}

interface ParamsPrices {
    beginAmountInUnits: number;
    endAmountInUnits: number;
    currentPriceInUnits: number;
}

const generateMarkersByPrices = ({ beginAmountInUnits, endAmountInUnits, currentPriceInUnits }: ParamsPrices) => {
    const dataNumbers: any[] = [];

    let start = +beginAmountInUnits.toFixed(2);
    const end = +endAmountInUnits.toFixed(2);
    const currentPrice = +currentPriceInUnits.toFixed(2);

    dataNumbers.push(start);
    while (start > end) {
        start = +(start - 0.01).toFixed(2);
        dataNumbers.push(start);
    }

    // Lets add some marker, first Price marker
    const indexCurrentPrice = dataNumbers.findIndex(element => {
        return element === currentPrice;
    });

    if (indexCurrentPrice) {
        dataNumbers[indexCurrentPrice] = {
            y: dataNumbers[indexCurrentPrice],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 8,
            },
        };
    }

    // Begin marker
    dataNumbers[0] = {
        y: dataNumbers[0],
        marker: {
            enabled: true,
            symbol: 'circle',
        },
    };

    // End marker
    dataNumbers[dataNumbers.length - 1] = {
        y: dataNumbers[dataNumbers.length - 1],
        marker: {
            enabled: true,
            symbol: 'circle',
        },
    };

    return dataNumbers;
};

export const DutchAuctionPriceChartCard = (props: Props) => {
    const { collectible } = props;
    const { order } = collectible;
    if (order === null || !isDutchAuction(order)) {
        return null;
    }

    const { makerAssetData, expirationTimeSeconds } = order;
    const { beginAmount, beginTimeSeconds } = getDutchAuctionData(makerAssetData);
    const price = getCollectiblePrice(collectible) as BigNumber;
    const { days, hours } = convertTimeInSecondsToDaysAndHours(expirationTimeSeconds.minus(beginTimeSeconds));

    const currentPriceInUnits = +tokenAmountInUnits(price, ETH_DECIMALS);
    const beginAmountInUnits = +tokenAmountInUnits(beginAmount, ETH_DECIMALS);
    const endAmountInUnits = +tokenAmountInUnits(order.takerAssetAmount, ETH_DECIMALS);

    const dataNumbers = generateMarkersByPrices({ beginAmountInUnits, endAmountInUnits, currentPriceInUnits });
    const options = {
        chart: {
            type: 'area',
            margin: [10, 5, 10, 10],
            height: 148,
            width: null,
        },
        title: {
            text: '',
        },
        subtitle: {
            text: '',
        },
        series: [
            {
                data: dataNumbers,
                color: '#00AE99',
                turboThreshold: dataNumbers.length,
            } as Highcharts.SeriesColumnOptions,
        ],
        credits: {
            enabled: false,
        },
        legend: {
            enabled: false,
        },
        xAxis: {
            title: {
                text: '',
            },
            labels: {
                enabled: false,
            },
            visible: false,
        },
        yAxis: {
            title: {
                text: '',
            },
            labels: {
                enabled: false,
            },
            visible: false,
            min: endAmountInUnits,
            max: beginAmountInUnits,
            startOnTick: false,
            endOnTick: false,
        },
        tooltip: {
            // prettier-ignore
            formatter() {
                const self: any = this;
                return `Price: <b>${self.y} ETH</b>`;
            }
        },
    };

    return (
        <Card>
            <CollectibleDescriptionInnerTitle>Price Chart</CollectibleDescriptionInnerTitle>
            <PriceChartContainer>
                <PriceChartPriceAndTime>
                    <PriceChartTitle>Current Price</PriceChartTitle>
                    <PriceChartValue>{currentPriceInUnits} ETH</PriceChartValue>
                    <PriceChartTitle>Time Remaining</PriceChartTitle>
                    <PriceChartValue>{`${days} Days ${hours} Hrs`}</PriceChartValue>
                </PriceChartPriceAndTime>
                <PriceChartGraphWrapper>
                    <PriceChartGraph>
                        <HighchartsReact highcharts={Highcharts} options={options} />
                    </PriceChartGraph>
                    <PriceChartGraphValues>
                        <div>
                            <PriceChartTitle>Start Price</PriceChartTitle>
                            <PriceChartValueNeutral>{beginAmountInUnits} ETH</PriceChartValueNeutral>
                        </div>
                        <div>
                            <PriceChartTitle>End Price</PriceChartTitle>
                            <PriceChartValueNeutral>{endAmountInUnits} ETH</PriceChartValueNeutral>
                        </div>
                    </PriceChartGraphValues>
                </PriceChartGraphWrapper>
            </PriceChartContainer>
        </Card>
    );
};
