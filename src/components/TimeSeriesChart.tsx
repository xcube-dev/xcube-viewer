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
    TooltipPayload,
    ReferenceArea, ReferenceLine,
} from 'recharts';
import IconButton from "@material-ui/core/IconButton";
import ZoomOutMap from "@material-ui/icons/ZoomOutMap";

import { TimeSeries } from '../model';
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core";
import { formatUtcTimeToLocal } from "../util/time";


const styles = (theme: Theme) => createStyles(
    {
        zoomOutButton: {
            right: -theme.spacing.unit * 20,
            position: "absolute",
        },
    });


interface TimeSeriesChartPoint {
    time: number;
    value: number;
}

interface TimeSeriesChartProps extends WithStyles<typeof styles> {
    timeSeriesCollection?: TimeSeries[];
    selectedTime?: string | null;
    selectTime?: (time: string | null) => void;
}

interface TimeSeriesChartState {
    isDragging: boolean;
    dragTime1: number | null;
    dragTime2: number | null;

    time1: number | null;
    time2: number | null;

}

const STROKES = ['grey', 'red', 'blue', 'green', 'yellow'];
const DOMAIN: [AxisDomain, AxisDomain] = ['dataMin', 'dataMax'];


class TimeSeriesChart extends React.Component<TimeSeriesChartProps, TimeSeriesChartState> {

    constructor(props: TimeSeriesChartProps) {
        super(props);
        this.state = TimeSeriesChart.newState();
    }

    render() {
        const {classes, timeSeriesCollection, selectedTime} = this.props;

        const {isDragging, dragTime1, dragTime2, time1, time2} = this.state;
        const isZoomed = time1 !== null && time2 !== null;

        let lines: JSX.Element[] = [];
        if (timeSeriesCollection) {
            lines = timeSeriesCollection.map((ts, i) => {
                const data: TimeSeriesChartPoint[] = [];
                ts.data.forEach(p => {
                    const time = new Date(p.time).getTime();
                    if (!isZoomed || (time >= time1! && time <= time2!)) {
                        data.push({value: p.average, time});
                    }
                });
                const source = ts.source;
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

        let referenceLine = null;
        if (selectedTime) {
            const time = new Date(selectedTime).getTime();
            referenceLine =
                <ReferenceLine isFront={true} x={time} stroke={"yellow"} strokeWidth={3} strokeOpacity={0.3}/>;
        }

        let referenceArea = null;
        if (isDragging && dragTime1 !== null && dragTime2 !== null) {
            referenceArea = <ReferenceArea x1={dragTime1} x2={dragTime2} strokeOpacity={0.3}/>;
        }

        let zoomOutButton = null;
        if (time1 && time2) {
            zoomOutButton = (
                <IconButton
                    className={classes.zoomOutButton}
                    aria-label="Zoom Out"
                    onClick={this.handleZoomOutButtonClicked}
                >
                    <ZoomOutMap/>
                </IconButton>
            );
        }

        // 99% per https://github.com/recharts/recharts/issues/172
        return (
            <div style={{userSelect: 'none'}}>
                {zoomOutButton}
                <ResponsiveContainer width="99%" height={320}>
                    <LineChart onMouseDown={this.handleMouseDown}
                               onMouseMove={this.handleMouseMove}
                               onMouseUp={this.handleMouseUp}
                               onClick={this.handleClick}
                    >
                        <XAxis dataKey="time"
                               type="number"
                               domain={DOMAIN}
                               tickFormatter={this.tickFormatter}/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip
                            labelFormatter={this.labelFormatter}
                            formatter={this.tooltipFormatter}/>
                        <Legend/>
                        {lines}
                        {referenceArea}
                        {referenceLine}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    readonly tickFormatter = (value: any) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            return null;
        }
        return formatUtcTimeToLocal(value);
    };

    // noinspection JSUnusedLocalSymbols
    readonly tooltipFormatter = (value: string | number | Array<string | number>,
                                 name: string,
                                 entry: TooltipPayload,
                                 index: number): React.ReactNode => {
        if (typeof value === 'number') {
            value = Math.round(100 * value) / 100;
        }
        return <span style={{color: 'black'}}>{value}&nbsp;</span>;
    };

    readonly labelFormatter = (label: string | number): React.ReactNode => {
        return <span>{this.tickFormatter(label)}</span>;
    };

    readonly handleClick = (event: any) => {
        if (event && this.props.selectTime) {
            this.props.selectTime(new Date(event.activeLabel).toISOString());
        }
        this.setState(TimeSeriesChart.newState());
    };

    readonly handleMouseDown = (event: any) => {
        if (event) {
            this.setState({isDragging: false, dragTime1: event.activeLabel, dragTime2: null});
        }
    };

    readonly handleMouseMove = (event: any) => {
        if (event && this.state.dragTime1) {
            this.setState({isDragging: true, dragTime2: event.activeLabel});
        }
    };

    readonly handleMouseUp = () => {
        this.zoomIn();
    };

    readonly handleZoomOutButtonClicked = () => {
        this.zoomOut();
    };

    private zoomIn() {
        let {dragTime1, dragTime2} = this.state;
        if (dragTime1 === dragTime2 || dragTime1 === null || dragTime2 === null) {
            this.setState(TimeSeriesChart.newState());
            return;
        }
        if (dragTime1 > dragTime2) {
            [dragTime1, dragTime2] = [dragTime2, dragTime1];
        }
        this.setState({isDragging: false, dragTime1: null, dragTime2: null, time1: dragTime1, time2: dragTime2});
    };

    private zoomOut() {
        this.setState(TimeSeriesChart.newState());
    };

    private static newState(): TimeSeriesChartState {
        return {isDragging: false, dragTime1: null, dragTime2: null, time1: null, time2: null};
    }
}

export default withStyles(styles)(TimeSeriesChart);
