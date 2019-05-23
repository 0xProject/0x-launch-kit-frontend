import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

interface Props {
    beginAmountInUnits: number;
    endAmountInUnits: number;
    currentPriceInUnits: number;
}

const CustomTooltip = (props: any) => {
    const { active } = props;

    if (active) {
        const { payload } = props;
        return <span>{payload[0].value} ETH</span>;
    }

    return null;
};

class DecliningPriceGraph extends React.Component<Props> {
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
                        stroke="#00AE99"
                        fill="#00AE99"
                        activeDot={{ r: 4 }}
                        dot={false}
                    />
                    <Area
                        type="monotone"
                        dataKey="markerLimit"
                        stroke="#00AE99"
                        fill="#00AE99"
                        dot={{ stroke: '#00AE99', strokeWidth: 4 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="currentPrice"
                        stroke="#00AE99"
                        fill="#00AE99"
                        dot={{ stroke: '#00AE99', strokeWidth: 8 }}
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

export { DecliningPriceGraph };
