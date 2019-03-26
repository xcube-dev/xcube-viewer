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
    ReferenceArea, ReferenceLine, TooltipProps
} from 'recharts';
import IconButton from '@material-ui/core/IconButton';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
import DeleteSweep from '@material-ui/icons/DeleteSweep';
import Typography from '@material-ui/core/Typography';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

import { equalTimeRanges, Time, TimeRange, TimeSeries, TimeSeriesPoint } from '../model/timeSeries';
import { utcTimeToLocalDateString, utcTimeToLocalDateTimeString } from '../util/time';
import { I18N, LINECHART_STROKES_DARK, LINECHART_STROKES_LIGHT } from '../config';
import { WithLocale } from "../util/lang";


const styles = (theme: Theme) => createStyles(
    {
        container: {
            userSelect: 'none',
            position: 'relative',
        },
        zoomOutButton: {
            position: 'absolute',
            right: 8 * theme.spacing.unit,
            margin: theme.spacing.unit,
            zIndex: 1000,
            opacity: 0.8,
        },
        removeAllButton: {
            position: 'absolute',
            right: theme.spacing.unit,
            margin: theme.spacing.unit,
            zIndex: 1000,
            opacity: 0.8,
        },
        toolTipContainer: {
            backgroundColor: 'black',
            opacity: 0.8,
            color: 'white',
            border: '2px solid black',
            borderRadius: theme.spacing.unit * 2,
            padding: theme.spacing.unit * 1.5,
        },
        toolTipValue: {
            fontWeight: 'bold',
        },
        toolTipLabel: {
            fontWeight: 'bold',
            paddingBottom: theme.spacing.unit,
        },
    });


interface TimeSeriesChartProps extends WithStyles<typeof styles>, WithLocale {
    theme: Theme;
    timeSeriesCollection?: TimeSeries[];
    selectedTime?: Time | null;
    selectTime?: (time: Time | null) => void;

    dataTimeRange?: TimeRange | null;
    selectedTimeRange?: TimeRange | null;
    selectTimeRange?: (timeRange: TimeRange | null) => void;

    removeAllTimeSeries?: () => void;
}

interface TimeSeriesChartState {
    isDragging: boolean;
    firstTime: Time | null;
    secondTime: Time | null;
}


const X_AXIS_DOMAIN: [AxisDomain, AxisDomain] = ['dataMin', 'dataMax'];
const Y_AXIS_DOMAIN: [AxisDomain, AxisDomain] = ['auto', 'auto'];


class TimeSeriesChart extends React.Component<TimeSeriesChartProps, TimeSeriesChartState> {

    constructor(props: TimeSeriesChartProps) {
        super(props);
        this.state = TimeSeriesChart.clearState();
    }

    render() {
        const {classes, timeSeriesCollection, selectedTime, selectedTimeRange, dataTimeRange, theme} = this.props;

        const strokes = theme.palette.type === 'light' ? LINECHART_STROKES_LIGHT : LINECHART_STROKES_DARK;
        const lightStroke = theme.palette.primary.light;
        const mainStroke = theme.palette.primary.main;
        const labelTextColor = theme.palette.primary.contrastText;

        const {isDragging, firstTime, secondTime} = this.state;

        let isZoomedIn = false, time1: number | null = null, time2: number | null = null;
        if (selectedTimeRange) {
            isZoomedIn = !equalTimeRanges(selectedTimeRange, dataTimeRange || null);
            [time1, time2] = selectedTimeRange;
        }

        let lines: JSX.Element[] = [];
        if (timeSeriesCollection) {
            lines = timeSeriesCollection.map((ts, i) => {
                let data: TimeSeriesPoint[] = ts.data;
                if (isZoomedIn) {
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
                        stroke={strokes[i % strokes.length]}
                        strokeWidth={3}
                        activeDot={true}
                    />
                );
            });
        }

        let referenceLine = null;
        if (selectedTime !== null) {
            referenceLine =
                <ReferenceLine isFront={true} x={selectedTime} stroke={mainStroke} strokeWidth={3}
                               strokeOpacity={0.5}/>;
        }

        let referenceArea = null;
        if (isDragging && firstTime !== null && secondTime !== null) {
            referenceArea =
                <ReferenceArea x1={firstTime} x2={secondTime} strokeOpacity={0.3} fill={lightStroke}
                               fillOpacity={0.3}/>;
        }

        const actionButtons = [];

        if (isZoomedIn) {
            const zoomOutButton = (
                <IconButton
                    key={'zoomOutButton'}
                    className={classes.zoomOutButton}
                    aria-label="Zoom Out"
                    onClick={this.handleZoomOutButtonClick}
                >
                    <ZoomOutMap/>
                </IconButton>
            );
            actionButtons.push(zoomOutButton);
        }

        if (timeSeriesCollection && timeSeriesCollection.length > 0) {
            const removeAllButton = (
                <IconButton
                    key={'removeAllButton'}
                    className={classes.removeAllButton}
                    aria-label="Remove all"
                    onClick={this.handleRemoveAllButtonClick}
                >
                    <DeleteSweep/>
                </IconButton>
            );
            actionButtons.push(removeAllButton);
        }

        const timeSeriesText = I18N.get("Time-Series");

        // 99% per https://github.com/recharts/recharts/issues/172
        return (
            <div className={classes.container}>
                <Typography variant='subtitle1'>{timeSeriesText}</Typography>
                {actionButtons}
                <ResponsiveContainer width="99%" height={320}>
                    <LineChart onMouseDown={this.handleMouseDown}
                               onMouseMove={this.handleMouseMove}
                               onMouseUp={this.handleMouseUp}
                               onClick={this.handleClick}
                               syncId="anyId"
                               style={{color: labelTextColor}}
                    >
                        <XAxis dataKey="time"
                               type="number"
                               tickCount={6}
                               domain={selectedTimeRange || X_AXIS_DOMAIN}
                               tickFormatter={this.tickFormatter}
                               stroke={labelTextColor}
                               allowDuplicatedCategory={false}
                        />
                        <YAxis dataKey="average"
                               type="number"
                               domain={Y_AXIS_DOMAIN}
                               stroke={labelTextColor}
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

    readonly handleZoomOutButtonClick = () => {
        this.zoomOut();
    };

    readonly handleRemoveAllButtonClick = () => {
        if (this.props.removeAllTimeSeries) {
            this.props.removeAllTimeSeries();
        }
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
                this.props.selectTimeRange(this.props.dataTimeRange || null);
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

export default withStyles(styles, {withTheme: true})(TimeSeriesChart);


interface _CustomTooltipProps extends TooltipProps, WithStyles<typeof styles> {
}

class _CustomTooltip extends React.PureComponent<_CustomTooltipProps> {
    render() {
        const {classes, active, label, payload} = this.props;
        if (typeof label !== 'number') {
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
