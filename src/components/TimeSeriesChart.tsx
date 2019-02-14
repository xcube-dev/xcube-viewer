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

const STROKES = ["#82ca9d", "#8884d8", "blue", "yellow", "green"];
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
                        type="monotone"
                        name={source.variableName}
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

    readonly tickFormatter = (utcTimeValue: number) => {
        if (!Number.isFinite(utcTimeValue)) {
            return null;
        }
        let isoString = new Date(utcTimeValue).toISOString();
        let i = isoString.indexOf("T");
        return isoString.substring(0, i);
    };


    readonly tooltipFormatter = (value: string | number | Array<string | number>,
                        name: string,
                        entry: TooltipPayload,
                        index: number): React.ReactNode => {
        console.log("tooltipFormatter: ", value, name, entry, index);
        return <p>---{name}---<br/>---{value}---<br/>---{index}---</p>;
    };

    readonly labelFormatter = (label: string | number): React.ReactNode => {
        console.log("labelFormatter: ", label);
        return <p>---{label}---</p>;
    };
}
