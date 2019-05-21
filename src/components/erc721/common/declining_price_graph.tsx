import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';

interface Props {
    beginAmountInUnits: number;
    endAmountInUnits: number;
    currentPriceInUnits: number;
}

const generateMarkersByPrices = ({ beginAmountInUnits, endAmountInUnits, currentPriceInUnits }: Props) => {
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

export const DecliningPriceGraph = ({ beginAmountInUnits, endAmountInUnits, currentPriceInUnits }: Props) => {
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
        // tslint:disable
        series: [
            {
                data: dataNumbers,
                color: '#00AE99',
                turboThreshold: dataNumbers.length,
            } as Highcharts.SeriesColumnOptions,
        ],
        // tslint:enable
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
            // tslint:disable
            // prettier-ignore
            formatter() {
                const self: any = this;
                return `Price: <b>${self.y} ETH</b>`;
            }
            // tslint:enable
        },
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};
