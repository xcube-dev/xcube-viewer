import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

import { WithLocale } from '../util/lang';
import TimeSeriesChart from './TimeSeriesChart';
import { Time, TimeRange, TimeSeriesGroup } from '../model/timeSeries';
import { PlaceInfo } from "../model/place";
import TimeRangeSlider from './TimeRangeSlider';


// noinspection JSUnusedLocalSymbols
const styles = (theme: Theme) => createStyles(
    {
        chartContainer: {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            flexFlow: 'flex-start',
            alignItems: 'center',
        },
        noChartsCard: {
            width: '20em',
        },
        noChartsTitle: {
            fontSize: 14,
        },
    });


interface TimeSeriesChartsProps extends WithStyles<typeof styles>, WithLocale {
    theme: Theme;
    timeSeriesGroups: TimeSeriesGroup[];
    selectedTime?: Time | null;
    selectTime?: (time: Time | null) => void;

    showPointsOnly: boolean;
    showErrorBars: boolean;

    dataTimeRange?: TimeRange | null;
    selectedTimeRange?: TimeRange | null;
    selectTimeRange?: (timeRange: TimeRange | null) => void;

    removeTimeSeriesGroup?: (id: string) => void;
    placeInfos?: { [placeId: string]: PlaceInfo };
}

class TimeSeriesCharts extends React.Component<TimeSeriesChartsProps> {

    render() {
        const {
            classes, locale,
            timeSeriesGroups,
            selectedTime, selectedTimeRange,
            dataTimeRange, selectTime, selectTimeRange,
            removeTimeSeriesGroup, showPointsOnly, showErrorBars,
            placeInfos
        } = this.props;
        const charts = timeSeriesGroups.map(timeSeriesGroup => (
            <TimeSeriesChart
                key={timeSeriesGroup.id}
                locale={locale}
                timeSeriesGroup={timeSeriesGroup}
                selectedTime={selectedTime}
                selectedTimeRange={selectedTimeRange}
                dataTimeRange={dataTimeRange}
                selectTime={selectTime}
                selectTimeRange={selectTimeRange}
                removeTimeSeriesGroup={removeTimeSeriesGroup}
                showPointsOnly={showPointsOnly}
                showErrorBars={showErrorBars}
                placeInfos={placeInfos}
            />)
        );
        if (charts.length > 0) {
            return (
                <div className={classes.chartContainer}>
                    <TimeRangeSlider
                        selectedTimeRange={selectedTimeRange}
                        dataTimeRange={dataTimeRange}
                        selectTimeRange={selectTimeRange}
                    />
                    {charts}
                </div>
            );
        } else {
            return null;
            /*
            return (
                <div className={classes.chartContainer}>
                    <Card className={classes.noChartsCard}>
                        <CardContent>
                            <Typography className={classes.noChartsTitle} color="textSecondary" gutterBottom>
                                {"No Time-Series Loaded"}
                            </Typography>
                            <Typography component="p">
                                {"Click into map to load time-series for that point!"}
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            );
            */
        }
    }
}

export default withStyles(styles, {withTheme: true})(TimeSeriesCharts);
