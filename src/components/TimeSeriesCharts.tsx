import * as React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

import { WithLocale } from '../util/lang';
import TimeSeriesChart from './TimeSeriesChart';
import { Time, TimeRange, TimeSeriesGroup } from '../model/timeSeries';
import { Place, PlaceInfo } from "../model/place";
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
    selectPlace: (placeId: string | null, places: Place[], showInMap: boolean) => void;
    places: Place[];
}

class TimeSeriesCharts extends React.Component<TimeSeriesChartsProps> {

    render() {
        const {
            classes, locale,
            timeSeriesGroups,
            selectedTime, selectedTimeRange,
            dataTimeRange, selectTime, selectTimeRange,
            removeTimeSeriesGroup, showPointsOnly, showErrorBars,
            placeInfos, places, selectPlace
        } = this.props;

        const charts = timeSeriesGroups.map((timeSeriesGroup: TimeSeriesGroup) => {
            const completed = timeSeriesGroup.timeSeriesArray.map(item => (
                item.dataProgress ? 100 * item.dataProgress : 0
            ));

            return (
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
                    completed={completed}
                    showPointsOnly={showPointsOnly}
                    showErrorBars={showErrorBars}
                    placeInfos={placeInfos}
                    places={places}
                    selectPlace={selectPlace}
                />
            );
        });

        if (charts.length === 0) {
            return null;
        }

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
    }
}

export default withStyles(styles, {withTheme: true})(TimeSeriesCharts);
