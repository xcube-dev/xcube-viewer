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
    ReferenceArea, ReferenceLine, TooltipProps, ErrorBar, DotProps
} from 'recharts';
import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AllOutIcon from '@material-ui/icons/AllOut';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { CircularProgress } from "@material-ui/core";

import { equalTimeRanges, Time, TimeRange, TimeSeries, TimeSeriesGroup, TimeSeriesPoint } from '../model/timeSeries';
import { utcTimeToLocalDateString, utcTimeToLocalDateTimeString } from '../util/time';
import {
    I18N,
    LINE_CHART_STROKE_SHADE_DARK_THEME,
    LINE_CHART_STROKE_SHADE_LIGHT_THEME,
    USER_PLACES_COLORS
} from '../config';
import { WithLocale } from '../util/lang';
import { Place, PlaceInfo } from '../model/place';


const styles = (theme: Theme) => createStyles(
    {
        chartContainer: {
            // userSelect: 'none',
            marginTop: theme.spacing(1),
            width: '99%',
            height: '32vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-stretch',
        },
        responsiveContainer: {
            flexGrow: 1,
        },
        zoomOutButton: {
            position: 'absolute',
            right: 8 * theme.spacing(1),
            margin: theme.spacing(1),
            zIndex: 1000,
            opacity: 0.8,
        },
        removeTimeSeriesGroup: {
            position: 'absolute',
            right: theme.spacing(1),
            margin: theme.spacing(1),
            zIndex: 1000,
            opacity: 0.8,
        },
        removeTimeSeriesProgress: {
            position: 'absolute',
            right: theme.spacing(1),
            margin: theme.spacing(2.5),
            zIndex: 1000,
            opacity: 0.8,
        },
        toolTipContainer: {
            backgroundColor: 'black',
            opacity: 0.8,
            color: 'white',
            border: '2px solid black',
            borderRadius: theme.spacing(2),
            padding: theme.spacing(1.5),
        },
        toolTipValue: {
            fontWeight: 'bold',
        },
        toolTipLabel: {
            fontWeight: 'bold',
            paddingBottom: theme.spacing(1),
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

    showPointsOnly: boolean;
    showErrorBars: boolean;

    selectTimeSeries?: (timeSeriesGroupId: string, timeSeriesIndex: number, timeSeries: TimeSeries) => void;

    removeTimeSeriesGroup?: (id: string) => void;
    completed: number[];

    placeInfos?: { [placeId: string]: PlaceInfo };

    selectPlace: (placeId: string | null, places: Place[], showInMap: boolean) => void;
    places: Place[];
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
        const {
            classes, timeSeriesGroup, selectedTime, selectedTimeRange,
            dataTimeRange, theme, placeInfos, showErrorBars, showPointsOnly,
        } = this.props;

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

            const source = ts.source;
            let lineName = source.variableName;
            let lineColor = 'yellow';
            if (placeInfos) {
                const placeInfo = placeInfos[source.placeId];
                if (placeInfo) {
                    const {place, label, color} = placeInfo;
                    if (place.geometry.type === 'Point') {
                        const lon = place.geometry.coordinates[0];
                        const lat = place.geometry.coordinates[1];
                        lineName += ` (${label}: ${lat.toFixed(5)},${lon.toFixed(5)})`;
                    } else {
                        lineName += ` (${label})`;
                    }
                    lineColor = color;
                }
            }

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
                        // noinspection SuspiciousTypeOfGuard
                        if ((typeof point.uncertainty) === 'number') {
                            hasErrorBars = true;
                        }
                    }
                }
            });
            const shadedLineColor = USER_PLACES_COLORS[lineColor][strokeShade];
            let errorBar;
            if (showErrorBars && hasErrorBars) {
                errorBar = (
                    <ErrorBar
                        dataKey="uncertainty"
                        width={4}
                        strokeWidth={1}
                        stroke={shadedLineColor}
                    />
                );
            }
            return (
                <Line
                    key={i}
                    type="monotone"
                    name={lineName}
                    unit={source.variableUnits}
                    data={data}
                    dataKey="average"
                    dot={<CustomizedDot radius={4} stroke={shadedLineColor} fill={'white'} strokeWidth={3}/>}
                    activeDot={<CustomizedDot radius={4} stroke={'white'} fill={shadedLineColor} strokeWidth={3}/>}
                    stroke={showPointsOnly ? '#00000000' :shadedLineColor}
                    strokeWidth={3 * (ts.dataProgress || 1)}
                    isAnimationActive={ts.dataProgress === 1.0}
                    onClick={() => this.handleTimeSeriesClick(timeSeriesGroup.id, i, ts)}
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
                    <AllOutIcon/>
                </IconButton>
            );
            actionButtons.push(zoomOutButton);
        }
        const progress = this.props.completed.reduce((a: number, b: number) => a + b , 0) / this.props.completed.length;
        const loading = !!(progress > 0 && progress < 100);

        //const progressBar = (<LinearProgress className={classes.removeTimeSeriesGroup} color="secondary" variant="determinate" value={progress}/>);
        const progressBar = (<CircularProgress size={24} className={classes.removeTimeSeriesProgress} color={"secondary"}/>);

        const removeButton = (
            (
                    <IconButton
                        key={'removeTimeSeriesGroup'}
                        className={classes.removeTimeSeriesGroup}
                        aria-label="Close"
                        onClick={this.handleRemoveTimeSeriesGroupClick}
                    >
                        <CloseIcon/>
                    </IconButton>)
        );

        const removeAllButton = loading ? progressBar : removeButton;

        actionButtons.push(removeAllButton);

        const timeSeriesText = I18N.get('Time-Series');
        const unitsText = timeSeriesGroup.variableUnits || I18N.get('unknown units');
        const chartTitle = `${timeSeriesText} (${unitsText})`;

        // 99% per https://github.com/recharts/recharts/issues/172
        return (
            <div className={classes.chartContainer}>
                <Typography className={classes.chartTitle}>{chartTitle}</Typography>
                {actionButtons}
                <ResponsiveContainer width="99%" className={classes.responsiveContainer}>
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

    readonly handleTimeSeriesClick = (timeSeriesGroupId: string, timeSeriesIndex: number, timeSeries: TimeSeries) => {
        const {selectTimeSeries, selectPlace, places} = this.props;
        console.log('handleTimeSeriesClick:', timeSeriesGroupId, timeSeriesIndex, timeSeries);
        if (!!selectTimeSeries) {
            selectTimeSeries(timeSeriesGroupId, timeSeriesIndex, timeSeries);
        }
        selectPlace(timeSeries.source.placeId, places, true);
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
            this.setState(TimeSeriesChart.newState(this.state.isDragging,
                this.state.firstTime,
                this.state.secondTime))
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

    private static newState(isDragging: boolean, firstTime: number | null, secondTime: number | null):
        TimeSeriesChartState {
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

interface CustomizedDotProps extends DotProps {
    radius: number;
    stroke: string;
    strokeWidth: number;
    fill: string;
}


const CustomizedDot = (props: CustomizedDotProps) => {

    const {cx, cy, radius, stroke, fill, strokeWidth} = props;

    const vpSize = 1024;
    const totalRadius = radius + 0.5 * strokeWidth;
    const totalDiameter = 2 * totalRadius;

    const r = Math.floor(100 * radius / totalDiameter + 0.5) + '%';
    const sw = Math.floor(100 * strokeWidth / totalDiameter + 0.5) + '%';

    // noinspection SuspiciousTypeOfGuard
    if (typeof cx === 'number' && typeof cy === 'number') {
        return (
            <svg x={cx - totalRadius} y={cy - totalRadius} width={totalDiameter} height={totalDiameter}
                 viewBox={`0 0 ${vpSize} ${vpSize}`}>
                <circle cx='50%' cy='50%' r={r} strokeWidth={sw} stroke={stroke} fill={fill}/>
            </svg>
        );
    }
    return null;
};