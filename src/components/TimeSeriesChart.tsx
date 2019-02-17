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
    ReferenceArea, ReferenceLine, TooltipProps,
} from 'recharts';
import IconButton from "@material-ui/core/IconButton";
import ZoomOutMap from "@material-ui/icons/ZoomOutMap";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core";

import { TimeSeries, TimeSeriesPoint } from '../model/timeSeries';
import { utcTimeToLocalDateString, utcTimeToLocalDateTimeString } from "../util/time";


const styles = (theme: Theme) => createStyles(
    {
        zoomOutButton: {
            position: "absolute",
            right: theme.spacing.unit * 3,
            margin: theme.spacing.unit,
            zIndex: 1000,
            opacity: 0.8,
        },
        toolTipContainer: {
            backgroundColor: "black",
            opacity: 0.8,
            color: "white",
            border: "2px solid black",
            borderRadius: theme.spacing.unit * 2,
            padding: theme.spacing.unit * 1.5,
        },
        toolTipValue: {
            fontWeight: "bold",
        },
        toolTipLabel: {
            fontWeight: "bold",
            paddingBottom: theme.spacing.unit,
        },
    });


interface TimeSeriesChartProps extends WithStyles<typeof styles> {
    timeSeriesCollection?: TimeSeries[];
    selectedTime?: string | null;
    selectTime?: (time: string | null) => void;

    selectedTimeRange?: [number, number] | null;
    selectTimeRange?: (timeRange: [number, number] | null) => void;
}

interface TimeSeriesChartState {
    isDragging: boolean;
    firstTime: number | null;
    secondTime: number | null;
}

const STROKES = ['grey', 'red', 'blue', 'green', 'yellow'];
const X_AXIS_DOMAIN: [AxisDomain, AxisDomain] = ['dataMin', 'dataMax'];
const X_AXIS_PADDING = {left: 20, right: 20};
const Y_AXIS_DOMAIN: [AxisDomain, AxisDomain] = ['auto', 'auto'];


class TimeSeriesChart extends React.Component<TimeSeriesChartProps, TimeSeriesChartState> {

    constructor(props: TimeSeriesChartProps) {
        super(props);
        this.state = TimeSeriesChart.clearState();
    }

    render() {
        const {classes, timeSeriesCollection, selectedTime, selectedTimeRange} = this.props;

        const {isDragging, firstTime, secondTime} = this.state;

        let isZoomed = false, time1: number | null = null, time2: number | null = null;
        if (selectedTimeRange) {
            isZoomed = true;
            [time1, time2] = selectedTimeRange;
        }

        let lines: JSX.Element[] = [];
        if (timeSeriesCollection) {
            lines = timeSeriesCollection.map((ts, i) => {
                let data: TimeSeriesPoint[] = ts.data;
                if (isZoomed) {
                    data = [];
                    ts.data.forEach(point => {
                        const time = point.time;
                        if (time >= time1! && time <= time2!) {
                            data.push(point);
                        }
                    });
                }
                const source = ts.source;
                return (
                    <Line
                        key={i}
                        type="monotone"
                        name={source.variableName}
                        unit={source.variableUnits}
                        data={data}
                        dataKey="average"
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
                <ReferenceLine isFront={true} x={time} stroke={"yellow"} strokeWidth={3} strokeOpacity={0.5}/>;
        }

        let referenceArea = null;
        if (isDragging && firstTime !== null && secondTime !== null) {
            referenceArea =
                <ReferenceArea x1={firstTime} x2={secondTime} strokeOpacity={0.3} fill={"red"} fillOpacity={0.3}/>;
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
                               domain={X_AXIS_DOMAIN}
                               padding={X_AXIS_PADDING}
                               tickFormatter={this.tickFormatter}
                        />
                        <YAxis type="number"
                               domain={Y_AXIS_DOMAIN}
                        />
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip content={<CustomTooltip/>}/>
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
        return utcTimeToLocalDateString(value);
    };

    readonly handleClick = (event: any) => {
        if (event && this.props.selectTime && event.activeLabel !== null && Number.isFinite(event.activeLabel)) {
            this.props.selectTime(event.activeLabel);
        }
        this.setState(TimeSeriesChart.clearState());
    };

    readonly handleMouseDown = (event: any) => {
        if (event) {
            this.setState(TimeSeriesChart.newState(false, event.activeLabel, null));
        }
    };

    readonly handleMouseMove = (event: any) => {
        let {firstTime} = this.state;
        if (event && firstTime) {
            this.setState(TimeSeriesChart.newState(true, firstTime, event.activeLabel));
        }
    };

    readonly handleMouseUp = () => {
        this.zoomIn();
    };

    readonly handleZoomOutButtonClicked = () => {
        this.zoomOut();
    };

    private zoomIn() {
        let {firstTime, secondTime} = this.state;
        if (firstTime === secondTime || firstTime === null || secondTime === null) {
            this.setState(TimeSeriesChart.clearState());
            return;
        }
        let [minTime, maxTime] = [firstTime, secondTime];
        if (minTime > maxTime) {
            [minTime, maxTime] = [maxTime, minTime];
        }
        this.setState(TimeSeriesChart.clearState(), () => {
            if (this.props.selectTimeRange) {
                this.props.selectTimeRange([minTime, maxTime]);
            }
        });
    };

    private zoomOut() {
        this.setState(TimeSeriesChart.clearState(), () => {
            if (this.props.selectTimeRange) {
                this.props.selectTimeRange(null);
            }
        });
    };

    private static newState(isDragging: boolean, firstTime: number | null, secondTime: number | null): TimeSeriesChartState {
        return {isDragging, firstTime, secondTime};
    }

    private static clearState(): TimeSeriesChartState {
        return TimeSeriesChart.newState(false, null, null);
    }

}

export default withStyles(styles)(TimeSeriesChart);


interface _CustomTooltipProps extends TooltipProps, WithStyles<typeof styles> {
}

class _CustomTooltip extends React.PureComponent<_CustomTooltipProps> {
    render() {
        const {classes, active, label, payload} = this.props;
        if (typeof label !== "number") {
            return null;
        }
        let items = null;
        if (payload && payload.length > 0) {
            items = payload.map((p: TooltipPayload, index: number) => {
                let {name, value, color, unit} = p;
                if (typeof value !== 'number') {
                    return null;
                }
                value = Math.round(100 * value) / 100;
                return (
                    <div key={index}>
                        <span>{name}:&nbsp;</span>
                        <span className={classes.toolTipValue} style={{color: color}}>{value}</span>
                        <span>&nbsp;{unit}</span>
                    </div>
                );
            });
        }

        if (active) {
            return (
                <div className={classes.toolTipContainer}>
                    <span className={classes.toolTipLabel}>{`${utcTimeToLocalDateTimeString(label)}`}</span>
                    {items}
                </div>
            );
        }
        return null;
    }
}

const CustomTooltip = withStyles(styles)(_CustomTooltip);
