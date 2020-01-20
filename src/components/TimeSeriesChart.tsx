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
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

import { equalTimeRanges, Time, TimeRange, TimeSeries, TimeSeriesGroup, TimeSeriesPoint } from '../model/timeSeries';
import { utcTimeToLocalDateString, utcTimeToLocalDateTimeString } from '../util/time';
import { getUserPlaceColor, I18N } from '../config';
import { WithLocale } from '../util/lang';
import { Place, PlaceInfo } from '../model/place';
import { useState } from 'react';


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
        actionButton: {
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


const X_AXIS_DOMAIN: [AxisDomain, AxisDomain] = ['dataMin', 'dataMax'];
const Y_AXIS_DOMAIN: [AxisDomain, AxisDomain] = ['auto', 'auto'];


const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
                                                             classes,
                                                             timeSeriesGroup,
                                                             selectTimeSeries,
                                                             selectedTime,
                                                             selectTime,
                                                             selectedTimeRange,
                                                             selectTimeRange,
                                                             places,
                                                             selectPlace,
                                                             placeInfos,
                                                             dataTimeRange,
                                                             theme,
                                                             showErrorBars,
                                                             showPointsOnly,
                                                             removeTimeSeriesGroup,
                                                             completed,
                                                         }) => {
    // isDragging: boolean, firstTime: number | null, secondTime: number | null
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [firstTime, setFirstTime] = useState<number | null>(null);
    const [secondTime, setSecondTime] = useState<number | null>(null);

    const setState = (isDragging: boolean, firstTime: number | null, secondTime: number | null) => {
        setIsDragging(isDragging);
        setFirstTime(firstTime);
        setSecondTime(secondTime);
    };

    const clearState = () => {
        setState(false, null, null);
    };

    const paletteType = theme.palette.type;
    const lightStroke = theme.palette.primary.light;
    const mainStroke = theme.palette.primary.main;
    const labelTextColor = theme.palette.primary.contrastText;

    let isZoomedIn = false, time1: number | null = null, time2: number | null = null;
    if (selectedTimeRange) {
        isZoomedIn = !equalTimeRanges(selectedTimeRange, dataTimeRange || null);
        [time1, time2] = selectedTimeRange;
    }

    const tickFormatter = (value: any) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            return null;
        }
        return utcTimeToLocalDateString(value);
    };

    const handleClick = (event: any) => {
        if (event && selectTime && event.activeLabel !== null && Number.isFinite(event.activeLabel)) {
            selectTime(event.activeLabel!);
        }
        clearState()
    };

    const handleTimeSeriesClick = (timeSeriesGroupId: string, timeSeriesIndex: number, timeSeries: TimeSeries) => {
        // console.log('handleTimeSeriesClick:', timeSeriesGroupId, timeSeriesIndex, timeSeries);
        if (!!selectTimeSeries) {
            selectTimeSeries(timeSeriesGroupId, timeSeriesIndex, timeSeries);
        }
        selectPlace(timeSeries.source.placeId, places, true);
    };

    const handleMouseDown = (event: any) => {
        if (event) {
            setState(false, event.activeLabel, null);
        }
    };

    const handleMouseMove = (event: any) => {
        if (event && firstTime) {
            setState(true, firstTime, event.activeLabel);
        }
    };

    const handleMouseUp = () => {
        zoomIn();
    };

    const handleZoomOutButtonClick = () => {
        zoomOut();
    };

    const handleRemoveTimeSeriesGroupClick = () => {
        if (removeTimeSeriesGroup) {
            removeTimeSeriesGroup(timeSeriesGroup.id);
        }
    };

    const zoomIn = () => {
        if (firstTime === secondTime || firstTime === null || secondTime === null) {
            clearState();
            return;
        }
        let [minTime, maxTime] = [firstTime, secondTime];
        if (minTime > maxTime) {
            [minTime, maxTime] = [maxTime, minTime];
        }
        clearState();
        if (selectTimeRange) {
            selectTimeRange([minTime, maxTime]);
        }
    };

    const zoomOut = () => {
        clearState();
        if (selectTimeRange) {
            selectTimeRange(dataTimeRange || null);
        }
    };

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
        const shadedLineColor = getUserPlaceColor(lineColor, paletteType);
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
                stroke={showPointsOnly ? '#00000000' : shadedLineColor}
                strokeWidth={3 * (ts.dataProgress || 1)}
                isAnimationActive={ts.dataProgress === 1.0}
                onClick={() => handleTimeSeriesClick(timeSeriesGroup.id, i, ts)}
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
                className={classes.actionButton}
                aria-label="Zoom Out"
                onClick={handleZoomOutButtonClick}
            >
                <AllOutIcon/>
            </IconButton>
        );
        actionButtons.push(zoomOutButton);
    }
    const progress = completed.reduce((a: number, b: number) => a + b, 0) / completed.length;
    const loading = (progress > 0 && progress < 100);

    let removeAllButton;
    if (loading) {
        removeAllButton = (
            <CircularProgress
                size={24}
                className={classes.actionButton}
                color={'secondary'}
            />
        );
    } else {
        removeAllButton = (
            <IconButton
                key={'removeTimeSeriesGroup'}
                className={classes.actionButton}
                aria-label="Close"
                onClick={handleRemoveTimeSeriesGroupClick}
            >
                <CloseIcon/>
            </IconButton>
        );
    }

    actionButtons.push(removeAllButton);

    const timeSeriesText = I18N.get('Time-Series');
    const unitsText = timeSeriesGroup.variableUnits || I18N.get('unknown units');
    const chartTitle = `${timeSeriesText} (${unitsText})`;

    // 99% per https://github.com/recharts/recharts/issues/172
    return (
        <div className={classes.chartContainer}>
            <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
                <Typography className={classes.chartTitle}>{chartTitle}</Typography>
                <Box display='flex' flexDirection='row' flexWrap='nowrap' alignItems='center'>
                    {actionButtons}
                </Box>
            </Box>
            <ResponsiveContainer width="99%" className={classes.responsiveContainer}>
                <LineChart onMouseDown={handleMouseDown}
                           onMouseMove={handleMouseMove}
                           onMouseUp={handleMouseUp}
                           onClick={handleClick}
                           syncId="anyId"
                           style={{color: labelTextColor}}
                >
                    <XAxis dataKey="time"
                           type="number"
                           tickCount={6}
                           domain={selectedTimeRange || X_AXIS_DOMAIN}
                           tickFormatter={tickFormatter}
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
};

export default withStyles(styles, {withTheme: true})(TimeSeriesChart);


interface _CustomTooltipProps extends TooltipProps, WithStyles<typeof styles> {
}

const _CustomTooltip: React.FC<_CustomTooltipProps> = ({classes, active, label, payload}) => {
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
};

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