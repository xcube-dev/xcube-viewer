/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as React from 'react';
import { WithStyles } from '@mui/styles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';
import { Theme } from '@mui/material';

import { WithLocale } from '../util/lang';
import TimeSeriesChart from './TimeSeriesChart';
import { Time, TimeRange, TimeSeriesGroup } from '../model/timeSeries';
import { Place, PlaceInfo } from '../model/place';
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

    removeTimeSeries?: (groupId: string, index: number) => void;
    removeTimeSeriesGroup?: (groupId: string) => void;
    placeInfos?: { [placeId: string]: PlaceInfo };
    selectPlace: (placeId: string | null, places: Place[], showInMap: boolean) => void;
    places: Place[];
}

const TimeSeriesCharts: React.FC<TimeSeriesChartsProps> = (
    {
        classes,
        locale,
        timeSeriesGroups,
        selectedTime,
        selectedTimeRange,
        dataTimeRange,
        selectTime,
        selectTimeRange,
        removeTimeSeries,
        removeTimeSeriesGroup,
        showPointsOnly,
        showErrorBars,
        placeInfos,
        places,
        selectPlace
    }
) => {


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
                removeTimeSeries={removeTimeSeries}
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
};

export default withStyles(styles, {withTheme: true})(TimeSeriesCharts);
