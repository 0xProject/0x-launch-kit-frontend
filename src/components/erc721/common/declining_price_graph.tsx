import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';

interface Props {
    beginAmountInUnits: number;
    endAmountInUnits: number;
    currentPriceInUnits: number;
}

const initialState = {
    options: {
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
        credits: {
            enabled: false,
        },
        legend: {
            enabled: false,
        },
        series: [],
        xAxis: {
            title: {
                text: '',
            },
            labels: {
                enabled: false,
            },
            visible: false,
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
    },
};

class DecliningPriceGraph extends React.Component<Props> {
    public state: any = {
        ...initialState,
    };

    public componentDidMount = () => {
        this._generateMarkersWithPrices();
    };

    public componentDidUpdate = (prevProps: Readonly<Props>) => {
        const { currentPriceInUnits } = this.props;
        if (prevProps.currentPriceInUnits !== currentPriceInUnits) {
            this._generateMarkersWithPrices();
        }
    };

    public render = () => {
        return <HighchartsReact highcharts={Highcharts} options={this.state.options} />;
    };

    private readonly _generateMarkersWithPrices = () => {
        const { beginAmountInUnits, endAmountInUnits, currentPriceInUnits } = this.props;

        let start = +beginAmountInUnits.toFixed(2);
        const end = +endAmountInUnits.toFixed(2);
        const currentPrice = +currentPriceInUnits.toFixed(2);

        const dataNumbers: any[] = [
            {
                y: start,
                marker: {
                    enabled: false,
                },
            },
        ];

        while (start > end) {
            start = +(start - 0.01).toFixed(2);
            dataNumbers.push({
                y: start,
                marker: {
                    enabled: false,
                },
            });
        }

        // Lets add some marker, first Price marker
        const indexCurrentPrice = dataNumbers.findIndex(element => {
            return element.y === currentPrice;
        });

        if (indexCurrentPrice) {
            dataNumbers[indexCurrentPrice] = {
                y: dataNumbers[indexCurrentPrice].y,
                marker: {
                    enabled: true,
                    symbol: 'circle',
                    radius: 8,
                },
            };
        }

        // Begin marker
        dataNumbers[0] = {
            y: dataNumbers[0].y,
            marker: {
                enabled: true,
                symbol: 'circle',
            },
        };

        // End marker
        dataNumbers[dataNumbers.length - 1] = {
            y: dataNumbers[dataNumbers.length - 1].y,
            marker: {
                enabled: true,
                symbol: 'circle',
            },
        };

        this.setState({
            options: {
                ...this.state.options,
                // tslint:disable
                series: [
                    {
                        data: dataNumbers,
                        color: '#00AE99',
                        turboThreshold: dataNumbers.length,
                    } as Highcharts.SeriesColumnOptions,
                ],
                // tslint:enable
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
            },
        });
    };
}

export { DecliningPriceGraph };
