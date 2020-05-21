import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { withTheme } from 'styled-components';

import { Theme } from '../../../themes/commons';

interface Props {
    beginAmountInUnits: number;
    endAmountInUnits: number;
    currentPriceInUnits: number;
    theme: Theme;
}

const CustomTooltip = (props: any) => {
    const { active } = props;

    if (active) {
        const { payload } = props;
        return <span>{payload[0].value} ETH</span>;
    }

    return null;
};

class DecliningPriceGraphContainer extends React.Component<Props> {
    public state: any = {
        dataNumbers: [],
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
        return (
            <ResponsiveContainer width="100%" height={148}>
                <AreaChart data={this.state.dataNumbers} margin={{ top: 15, right: 30, left: 20, bottom: 15 }}>
                    <Tooltip content={CustomTooltip} />
                    <YAxis
                        hide={true}
                        domain={[dataMin => this.props.endAmountInUnits, dataMax => this.props.beginAmountInUnits]}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={this.props.theme.componentsTheme.chartColor}
                        fill={this.props.theme.componentsTheme.chartColor}
                        activeDot={{ r: 4 }}
                        dot={false}
                    />
                    <Area
                        type="monotone"
                        dataKey="markerLimit"
                        stroke={this.props.theme.componentsTheme.chartColor}
                        fill={this.props.theme.componentsTheme.chartColor}
                        dot={{ stroke: this.props.theme.componentsTheme.chartColor, strokeWidth: 4 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="currentPrice"
                        stroke={this.props.theme.componentsTheme.chartColor}
                        fill={this.props.theme.componentsTheme.chartColor}
                        dot={{ stroke: this.props.theme.componentsTheme.chartColor, strokeWidth: 8 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        );
    };

    private readonly _generateMarkersWithPrices = () => {
        const { beginAmountInUnits, endAmountInUnits, currentPriceInUnits } = this.props;

        let start = +beginAmountInUnits.toFixed(2);
        const end = +endAmountInUnits.toFixed(2);
        const currentPrice = +currentPriceInUnits.toFixed(2);

        const dataNumbers: any[] = [
            {
                price: start,
            },
        ];

        while (start > end) {
            start = +(start - 0.01).toFixed(2);
            dataNumbers.push({
                price: start,
            });
        }

        // Lets add some marker, first Price marker
        const indexCurrentPrice = dataNumbers.findIndex(element => {
            return element.price === currentPrice;
        });

        if (indexCurrentPrice) {
            dataNumbers[indexCurrentPrice] = {
                price: dataNumbers[indexCurrentPrice].price,
                currentPrice: dataNumbers[indexCurrentPrice].price,
            };
        }

        // Begin marker
        dataNumbers[0] = {
            price: dataNumbers[0].price,
            markerLimit: dataNumbers[0].price,
        };

        // End marker
        dataNumbers[dataNumbers.length - 1] = {
            price: dataNumbers[dataNumbers.length - 1].price,
            markerLimit: dataNumbers[dataNumbers.length - 1].price,
        };

        this.setState({
            dataNumbers,
        });
    };
}

const DecliningPriceGraph = withTheme(DecliningPriceGraphContainer);

export { DecliningPriceGraph };
