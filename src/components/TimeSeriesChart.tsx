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
    ReferenceArea, ReferenceLine, TooltipProps, ErrorBar
} from 'recharts';
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
import Close from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import { equalTimeRanges, Time, TimeRange, TimeSeriesGroup, TimeSeriesPoint } from '../model/timeSeries';
import { utcTimeToLocalDateString, utcTimeToLocalDateTimeString } from '../util/time';
import {
    I18N,
    LINE_CHART_STROKE_SHADE_DARK_THEME,
    LINE_CHART_STROKE_SHADE_LIGHT_THEME,
    USER_PLACES_COLORS
} from '../config';
import { WithLocale } from "../util/lang";


const styles = (theme: Theme) => createStyles(
    {
        chartContainer: {
            userSelect: 'none',
            position: 'relative',
            width: "99%",
        },
        zoomOutButton: {
            position: 'absolute',
            right: 8 * theme.spacing.unit,
            margin: theme.spacing.unit,
            zIndex: 1000,
            opacity: 0.8,
        },
        removeTimeSeriesGroup: {
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
        chartTitle: {}
    });


interface TimeSeriesChartProps extends WithStyles<typeof styles>, WithLocale {
    theme: Theme;
    timeSeriesGroup: TimeSeriesGroup;
    selectedTime?: Time | null;
    selectTime?: (time: Time | null) => void;

    dataTimeRange?: TimeRange | null;
    selectedTimeRange?: TimeRange | null;
    selectTimeRange?: (timeRange: TimeRange | null) => void;

    removeTimeSeriesGroup?: (id: string) => void;
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
        const {classes, timeSeriesGroup, selectedTime, selectedTimeRange, dataTimeRange, theme} = this.props;

        const strokeShade = theme.palette.type === 'light' ? LINE_CHART_STROKE_SHADE_LIGHT_THEME : LINE_CHART_STROKE_SHADE_DARK_THEME;
        const lightStroke = theme.palette.primary.light;
        const mainStroke = theme.palette.primary.main;
        const labelTextColor = theme.palette.primary.contrastText;

        const {isDragging, firstTime, secondTime} = this.state;

        let isZoomedIn = false, time1: number | null = null, time2: number | null = null;
        if (selectedTimeRange) {
            isZoomedIn = !equalTimeRanges(selectedTimeRange, dataTimeRange || null);
            [time1, time2] = selectedTimeRange;
        }

        const lines = timeSeriesGroup.timeSeriesArray.map((ts, i) => {
            const data: TimeSeriesPoint[] = [];
            let hasErrorBars = false;
            ts.data.forEach(point => {
                if (point.average !== null) {
                    let time1Ok = true;
                    let time2Ok = true;
                    if (time1 !== null) {
                        time1Ok = point.time >= time1;
                    }
                    if (time2 !== null) {
                        time2Ok = point.time <= time2;
                    }
                    if (time1Ok && time2Ok) {
                        data.push(point);
                    }
                    // noinspection SuspiciousTypeOfGuard
                    if ((typeof point.uncertainty) === "number") {
                        hasErrorBars = true;
                    }
                }
            });
            let errorBar;
            if (hasErrorBars) {
                errorBar = (
                    <ErrorBar
                        dataKey="uncertainty"
                        width={4}
                        strokeWidth={2}
                        stroke={USER_PLACES_COLORS[ts.color][strokeShade]}
                    />
                );
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
                    stroke={USER_PLACES_COLORS[ts.color][strokeShade]}
                    strokeWidth={3 * (ts.dataProgress || 1)}
                    activeDot={true}
                    isAnimationActive={ts.dataProgress === 1.0}
                >{errorBar}</Line>
            );
        });

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

        const removeAllButton = (
            <IconButton
                key={'removeTimeSeriesGroup'}
                className={classes.removeTimeSeriesGroup}
                aria-label="Close"
                onClick={this.handleRemoveTimeSeriesGroupClick}
            >
                <Close/>
            </IconButton>
        );
        actionButtons.push(removeAllButton);

        const timeSeriesText = I18N.get("Time-Series");
        const unitsText = timeSeriesGroup.variableUnits || I18N.get("unknown units");
        const chartTitle = `${timeSeriesText} (${unitsText})`;

        // 99% per https://github.com/recharts/recharts/issues/172
        return (
            <div className={classes.chartContainer}>
                <Typography className={classes.chartTitle}>{chartTitle}</Typography>
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

    readonly handleRemoveTimeSeriesGroupClick = () => {
        if (this.props.removeTimeSeriesGroup) {
            this.props.removeTimeSeriesGroup(this.props.timeSeriesGroup.id);
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
        if (!active) {
            return null;
        }
        if (typeof label !== 'number') {
            return null;
        }
        if (!payload || payload.length === 0) {
            return null;
        }
        const items = payload.map((p: TooltipPayload, index: number) => {
            let {name, value, color, unit} = p;
            if (typeof value !== 'number') {
                return null;
            }
            // let valueText;
            // if (typeof p.uncertainty === 'number') {
            //     valueText = `${value.toFixed(2)} ±${p.uncertainty.toFixed(2)} (uncertainty)`;
            // } else {
            //     valueText = value.toFixed(3);
            // }
            const valueText = value.toFixed(3);
            return (
                <div key={index}>
                    <span>{name}:&nbsp;</span>
                    <span className={classes.toolTipValue} style={{color: color}}>{valueText}</span>
                    <span>&nbsp;{unit}</span>
                </div>
            );
        });

        if (!items) {
            return null;
        }

        return (
            <div className={classes.toolTipContainer}>
                <span className={classes.toolTipLabel}>{`${utcTimeToLocalDateTimeString(label)}`}</span>
                {items}
            </div>
        );
    }
}

const CustomTooltip = withStyles(styles)(_CustomTooltip);
