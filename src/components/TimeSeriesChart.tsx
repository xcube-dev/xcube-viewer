import * as React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    AxisDomain,
    TooltipPayload
} from 'recharts';
import { TimeSeries } from "../types/timeSeries";


interface TimeSeriesChartProps {
    timeSeriesCollection?: TimeSeries[];
}

const STROKES = ["grey", "red", "blue", "green", "yellow"];
const DOMAIN: [AxisDomain, AxisDomain] = ["dataMin", "dataMax"];

export default class TimeSeriesChart extends React.Component<TimeSeriesChartProps> {

    render() {
        const {timeSeriesCollection} = this.props;

        let lines: JSX.Element[] = [];
        if (timeSeriesCollection) {
            lines = timeSeriesCollection.map((ts, i) => {
                const source = ts.source;
                const data = ts.data.map(p => {
                    return {value: p.average, time: new Date(p.time).getTime()}
                });
                return (
                    <Line
                        key={i}
                        type="monotone"
                        name={source.variableName}
                        unit={source.variableUnits}
                        data={data}
                        dataKey="value"
                        connectNulls={true}
                        dot={true}
                        stroke={STROKES[i % STROKES.length]}
                        strokeWidth={3}
                        activeDot={true}
                    />
                );
            });
        }

        return (
            // 99% per https://github.com/recharts/recharts/issues/172
            <ResponsiveContainer width="99%" height={320}>
                <LineChart>
                    <XAxis dataKey="time"
                           type="number"
                           domain={DOMAIN}
                           tickFormatter={this.tickFormatter}/>
                    <YAxis/>
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                    />
                    <Tooltip
                        labelFormatter={this.labelFormatter}
                        formatter={this.tooltipFormatter}/>
                    <Legend/>
                    {lines}
                </LineChart>
            </ResponsiveContainer>
        );
    }

    readonly tickFormatter = (value: any) => {
        if (typeof value !== "number" || !Number.isFinite(value)) {
            return null;
        }
        let isoString = new Date(value).toISOString();
        let i = isoString.indexOf("T");
        return isoString.substring(0, i);
    };

    // noinspection JSUnusedLocalSymbols
    readonly tooltipFormatter = (value: string | number | Array<string | number>,
                                 name: string,
                                 entry: TooltipPayload,
                                 index: number): React.ReactNode => {
        if (typeof value === "number") {
            value = Math.round(100 * value) / 100;
        }
        return <span style={{color: "black"}}>{value}&nbsp;</span>;
    };

    readonly labelFormatter = (label: string | number): React.ReactNode => {
        return <span>{this.tickFormatter(label)}</span>;
    };
}
