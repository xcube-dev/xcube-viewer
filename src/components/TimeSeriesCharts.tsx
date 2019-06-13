import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

import { WithLocale } from '../util/lang';
import TimeSeriesChart from './TimeSeriesChart';
import { Time, TimeRange, TimeSeriesGroup } from '../model/timeSeries';
// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
// import Typography from '@material-ui/core/Typography';
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

    dataTimeRange?: TimeRange | null;
    selectedTimeRange?: TimeRange | null;
    selectTimeRange?: (timeRange: TimeRange | null) => void;
    visibleTimeRange?: TimeRange | null;
    updateVisibleTimeRange?: (timeRange: TimeRange | null) => void;

    removeTimeSeriesGroup?: (id: string) => void;
}

class TimeSeriesCharts extends React.Component<TimeSeriesChartsProps> {

    render() {
        const {
            classes, locale,
            timeSeriesGroups,
            selectedTime, selectedTimeRange,
            dataTimeRange, selectTime, selectTimeRange,
            removeTimeSeriesGroup,
            visibleTimeRange,
            updateVisibleTimeRange,
        }
            = this.props;
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
            />)
        );
        if (charts.length > 0) {
            return (
                <div className={classes.chartContainer}>
                    <TimeRangeSlider
                        selectedTimeRange={selectedTimeRange}
                        dataTimeRange={dataTimeRange}
                        selectTimeRange={selectTimeRange}
                        visibleTimeRange={visibleTimeRange}
                        updateVisibleTimeRange={updateVisibleTimeRange}
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
