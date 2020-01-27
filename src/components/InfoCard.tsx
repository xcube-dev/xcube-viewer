import { CardMedia } from '@material-ui/core';
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import WidgetsIcon from '@material-ui/icons/Widgets';
import LayersIcon from '@material-ui/icons/Layers';
import PlaceIcon from '@material-ui/icons/Place';
import CloseIcon from '@material-ui/icons/Close';
import CodeIcon from '@material-ui/icons/Code';
import InfoIcon from '@material-ui/icons/Info';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import { I18N } from '../config';

import { Dataset } from '../model/dataset';
import { Variable } from '../model/variable';
import { PlaceInfo } from '../model/place';
import { WithLocale } from '../util/lang';


// TODO (forman): let xcube serve publish dataset and variable attributes
// TODO (forman): use a dataset's and variable's specific label, description mappings for rendering

const useStyles = makeStyles((theme: Theme) => createStyles(
    {
        card: {
            maxWidth: '100%',
            marginBottom: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        info: {
            marginRight: theme.spacing(1),
        },
        close: {
            marginLeft: 'auto',
        },
        table: {},
        keyValueTableContainer: {
            background: theme.palette.divider,
        },
        variableHtmlReprContainer: {
            background: theme.palette.divider,
            padding: theme.spacing(1),
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
    }
));


interface InfoCardProps extends WithLocale {
    infoCardOpen: boolean;
    showInfoCard: (infoCardOpen: boolean) => void;
    visibleInfoCardElements: string[];
    setVisibleInfoCardElements: (visibleInfoCardElements: string[]) => void;
    infoCardElementViewModes: { [elementType: string]: string };
    updateInfoCardElementViewMode: (elementType: string, viewMode: string) => void;
    selectedDataset: Dataset | null;
    selectedVariable: Variable | null;
    selectedPlaceInfo: PlaceInfo | null;
}

const InfoCard: React.FC<InfoCardProps> = ({
                                               infoCardOpen,
                                               showInfoCard,
                                               visibleInfoCardElements,
                                               setVisibleInfoCardElements,
                                               infoCardElementViewModes,
                                               updateInfoCardElementViewMode,
                                               selectedDataset,
                                               selectedVariable,
                                               selectedPlaceInfo,
                                           }) => {
    const classes = useStyles();

    if (!infoCardOpen) {
        return null;
    }

    const handleInfoElementsChanges = (event: React.MouseEvent<HTMLElement>, visibleElementTypes: string[]) => {
        setVisibleInfoCardElements(visibleElementTypes);
    };

    const handleInfoCardClose = () => {
        showInfoCard(false);
    };

    // TODO (forman): fix ugly code duplication below!
    let datasetInfoContent;
    let variableInfoContent;
    let placeInfoContent;
    if (selectedDataset) {
        const elementType = 'dataset';
        const viewMode = infoCardElementViewModes[elementType];
        const setViewMode = (viewMode: string) => updateInfoCardElementViewMode(elementType, viewMode);
        const isVisible = visibleInfoCardElements.includes(elementType);
        datasetInfoContent = (
            <DatasetInfoContent
                isIn={isVisible}
                viewMode={viewMode}
                setViewMode={setViewMode}
                dataset={selectedDataset}/>
        );
    }
    if (selectedVariable) {
        const elementType = 'variable';
        const viewMode = infoCardElementViewModes[elementType];
        const setViewMode = (viewMode: string) => updateInfoCardElementViewMode(elementType, viewMode);
        const isVisible = visibleInfoCardElements.includes(elementType);
        variableInfoContent = (
            <VariableInfoContent
                isIn={isVisible}
                viewMode={viewMode}
                setViewMode={setViewMode}
                variable={selectedVariable}
            />
        );
    }
    if (selectedPlaceInfo) {
        const elementType = 'place';
        const viewMode = infoCardElementViewModes[elementType];
        const setViewMode = (viewMode: string) => updateInfoCardElementViewMode(elementType, viewMode);
        const isVisible = visibleInfoCardElements.includes(elementType);
        placeInfoContent = (
            <PlaceInfoContent
                isIn={isVisible}
                viewMode={viewMode}
                setViewMode={setViewMode}
                placeInfo={selectedPlaceInfo}/>
        );
    }

    return (
        <Card className={classes.card}>
            <CardActions disableSpacing>
                <InfoIcon fontSize={'large'} className={classes.info}/>
                <ToggleButtonGroup key={0} size="small" value={visibleInfoCardElements}
                                   onChange={handleInfoElementsChanges}>
                    {/*TODO (forman): fix ugly code duplication below!*/}
                    <ToggleButton key={0} value="dataset" disabled={selectedDataset === null}>
                        <Tooltip title={I18N.get('Dataset information')}>
                            <WidgetsIcon/>
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton key={1} value="variable" disabled={selectedVariable === null}>
                        <Tooltip title={I18N.get('Variable information')}>
                            <LayersIcon/>
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton key={2} value="place" disabled={selectedPlaceInfo === null}>
                        <Tooltip title={I18N.get('Place information')}>
                            <PlaceIcon/>
                        </Tooltip>
                    </ToggleButton>
                </ToggleButtonGroup>
                <IconButton key={1} onClick={handleInfoCardClose} className={classes.close}>
                    {<CloseIcon/>}
                </IconButton>
            </CardActions>
            {datasetInfoContent}
            {variableInfoContent}
            {placeInfoContent}
        </Card>
    );
};

export default InfoCard;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface DatasetInfoContentProps {
    isIn: boolean;
    viewMode: string;
    setViewMode: (viewMode: string) => void;
    dataset: Dataset;
}

const DatasetInfoContent: React.FC<DatasetInfoContentProps> = ({isIn, viewMode, setViewMode, dataset}) => {
    // const classes = useStyles();
    let content;
    if (viewMode === 'code') {
        content = (
            <CardContent><code>{JSON.stringify(dataset, ['id', 'title', 'dimensions', 'bbox'], 2)}</code></CardContent>);
    } else if (viewMode === 'text') {
        const data: KeyValue[] = [
            [I18N.get('Dimension names'), dataset.dimensions.map(d => d.name).join(', ')],
            [I18N.get('Dimension data types'), dataset.dimensions.map(d => d.dtype).join(', ')],
            [I18N.get('Dimension lengths'), dataset.dimensions.map(d => d.size).join(', ')],
            [I18N.get('Geographical extent') + ' (x1, y1, x2, y2)', dataset.bbox.map(x => x + '').join(', ')],
        ];
        content = <CardContent><KeyValueTable data={data}/></CardContent>;
    } else {
        content = <CardContent><Typography>Coming soon...</Typography></CardContent>;
    }
    return (
        <InfoCardContent
            title={dataset.title || '?'}
            subheader={dataset.title && `ID: ${dataset.id}`}
            isIn={isIn}
            viewMode={viewMode}
            setViewMode={setViewMode}
        >
            {content}
        </InfoCardContent>
    );
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface VariableInfoContentProps {
    isIn: boolean;
    viewMode: string;
    setViewMode: (viewMode: string) => void;
    variable: Variable;
}

const VariableInfoContent: React.FC<VariableInfoContentProps> = ({isIn, viewMode, setViewMode, variable}) => {
    const classes = useStyles();
    let content;
    let htmlReprPaper;
    if (viewMode === 'code') {
        content = (
            <CardContent><code>
                {JSON.stringify(variable,
                                ['id', 'name', 'title', 'units', 'shape', 'dtype',
                                    'colorBarMin',
                                    'colorBarMax',
                                    'colorBarName'],
                                2)}
            </code></CardContent>
        );
    } else if (viewMode === 'text') {
        const data: KeyValue[] = [
            [I18N.get('Title'), variable.title],
            [I18N.get('Name'), variable.name],
            [I18N.get('Units'), variable.units],
            [I18N.get('Data type'), variable.dtype],
            [I18N.get('Dimension names'), variable.dims.join(', ')],
            [I18N.get('Dimension lengths'), variable.shape.map(s => s + '').join(', ')],
        ];
        content = (<CardContent><KeyValueTable data={data}/></CardContent>);
        if (variable.htmlRepr) {
            const handleRef = (element: HTMLDivElement | null) => {
                if (element && variable.htmlRepr) {
                    element.innerHTML = variable.htmlRepr;
                }
            };
            htmlReprPaper = (
                <CardContent><Paper ref={handleRef} className={classes.variableHtmlReprContainer}/></CardContent>
            );
        }
    } else {
        content = <CardContent><Typography>Coming soon...</Typography></CardContent>;
    }
    return (
        <InfoCardContent
            title={variable.title || variable.name}
            subheader={`${I18N.get('Name')}: ${variable.name}`}
            isIn={isIn}
            viewMode={viewMode}
            setViewMode={setViewMode}
        >
            {content}
            {htmlReprPaper}
        </InfoCardContent>
    );
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface PlaceInfoContentProps {
    isIn: boolean;
    viewMode: string;
    setViewMode: (viewMode: string) => void;
    placeInfo: PlaceInfo;
}

const PlaceInfoContent: React.FC<PlaceInfoContentProps> = ({isIn, viewMode, setViewMode, placeInfo}) => {
    const place = placeInfo.place;
    let content;
    let image;
    let description;
    if (viewMode === 'code') {
        content = <CardContent><code>{JSON.stringify(place, null, 2)}</code></CardContent>;
    } else if (viewMode === 'text') {
        if (placeInfo.image && placeInfo.image.startsWith('http')) {
            image = <CardMedia src={placeInfo.image} title={placeInfo.label}/>;
        }
        if (placeInfo.description) {
            description = <CardContent><Typography>{placeInfo.description}</Typography></CardContent>;
        }
    } else {
        if (!!place.properties) {
            const data: KeyValue[] = Object.getOwnPropertyNames(place.properties).map(
                (name: any) => [name, place.properties![name]]
            );
            content = <CardContent><KeyValueTable data={data}/></CardContent>;
        } else {
            content =
                <CardContent><Typography>{I18N.get('There is no information available for this location.')}</Typography></CardContent>;
        }
    }
    return (
        <InfoCardContent
            title={placeInfo.label}
            subheader={`${I18N.get('Geometry type')}: ${I18N.get(place.geometry.type)}`}
            isIn={isIn}
            viewMode={viewMode}
            setViewMode={setViewMode}
        >
            {image}
            {description}
            {content}
        </InfoCardContent>
    );
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface InfoCardContentProps {
    isIn: boolean;
    title: React.ReactNode;
    subheader?: React.ReactNode;
    viewMode: string;
    setViewMode: (viewMode: string) => void;
}

const InfoCardContent: React.FC<InfoCardContentProps> = ({
                                                             isIn,
                                                             title,
                                                             subheader,
                                                             viewMode,
                                                             setViewMode,
                                                             children,
                                                         }) => {
    // const classes = useStyles();

    const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, viewMode: string) => {
        setViewMode(viewMode);
    };

    return (
        <Collapse in={isIn} timeout="auto" unmountOnExit>
            <CardHeader
                title={title}
                subheader={subheader}
                action={
                    <ToggleButtonGroup key={0}
                                       size="small"
                                       value={viewMode}
                                       exclusive={true}
                                       onChange={handleViewModeChange}>
                        <ToggleButton key={0} value="text">
                            <TextFieldsIcon/>
                        </ToggleButton>
                        <ToggleButton key={1} value="list">
                            <ListAltIcon/>
                        </ToggleButton>
                        <ToggleButton key={2} value="code">
                            <CodeIcon/>
                        </ToggleButton>
                    </ToggleButtonGroup>
                }
            />
            {children}
        </Collapse>
    );
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type KeyValue = [any, any];

interface KeyValueTableProps {
    data: KeyValue[];
}

const KeyValueTable: React.FC<KeyValueTableProps> = ({data}) => {
    const classes = useStyles();
    return (
        <TableContainer component={Paper} className={classes.keyValueTableContainer}>
            <Table className={classes.table} size="small">
                <TableBody>
                    {
                        data.map((kv, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>{kv[0]}</TableCell>
                                    <TableCell align="right">{kv[1]}</TableCell>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
