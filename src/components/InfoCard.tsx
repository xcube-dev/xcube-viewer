import React, { useState } from 'react';
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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { Dataset } from '../model/dataset';
import { Variable } from '../model/variable';
import { DEFAULT_LABEL_PROPERTY_NAMES, getPlaceLabel, Place } from '../model/place';

// TODO (forman): let xcube serve publish ds and var attributes
// TODO (forman): use dataset, var, place group specific lable, description, and image mappings for rendering
// TODO (forman): put view settings (ds, var, place: panel on/aff, code on/of) in store and local storage

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
    }
));

interface InfoCardProps {
    infoCardOpen: boolean;
    selectedDataset: Dataset | null;
    selectedVariable: Variable | null;
    selectedPlace: Place | null;
    showInfoCard: (infoCardOpen: boolean) => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
                                               infoCardOpen,
                                               selectedDataset,
                                               selectedVariable,
                                               selectedPlace,
                                               showInfoCard,
                                           }) => {

    const classes = useStyles();
    const [infoElements, setInfoElements] = useState<string[]>(["dataset", "variable", "place"]);
    const [datasetCodeMode, setDatasetCodeMode] = useState(false);
    const [variableCodeMode, setVariableCodeMode] = useState(false);
    const [placeCodeMode, setPlaceCodeMode] = useState(false);

    if (!infoCardOpen) {
        return null;
    }

    const handleInfoElementsChanges = (event: React.MouseEvent<HTMLElement>, value: any) => {
        setInfoElements(value);
    };

    const handleInfoCardClose = () => {
        showInfoCard(false);
    };

    let effectiveInfoElements = [];
    let datasetInfoContent;
    let variableInfoContent;
    let placeInfoContent;

    if (selectedDataset) {
        const isIn = infoElements.includes('dataset');
        if (isIn) {
            effectiveInfoElements.push('dataset');
        }
        datasetInfoContent = (
            <DatasetInfoContent
                isIn={isIn}
                codeMode={datasetCodeMode}
                setCodeMode={setDatasetCodeMode}
                dataset={selectedDataset}/>
        );
    }
    if (selectedVariable) {
        const isIn = infoElements.includes('variable');
        if (isIn) {
            effectiveInfoElements.push('variable');
        }
        variableInfoContent = (
            <VariableInfoContent
                isIn={isIn}
                codeMode={variableCodeMode}
                setCodeMode={setVariableCodeMode}
                variable={selectedVariable}/>
        );
    }
    if (selectedPlace) {
        const isIn = infoElements.includes('place');
        if (isIn) {
            effectiveInfoElements.push('place');
        }
        placeInfoContent = (
            <PlaceInfoContent
                isIn={isIn}
                codeMode={placeCodeMode}
                setCodeMode={setPlaceCodeMode}
                place={selectedPlace}/>
        );
    }

    return (
        <Card className={classes.card}>
            <CardActions disableSpacing>
                <InfoIcon fontSize={'large'} className={classes.info}/>
                <ToggleButtonGroup key={0} size="small" value={effectiveInfoElements}
                                   onChange={handleInfoElementsChanges}>
                    <ToggleButton key={0} value="dataset" disabled={selectedDataset === null}>
                        <WidgetsIcon/>
                    </ToggleButton>
                    <ToggleButton key={1} value="variable" disabled={selectedVariable === null}>
                        <LayersIcon/>
                    </ToggleButton>
                    <ToggleButton key={2} value="place" disabled={selectedPlace === null}>
                        <PlaceIcon/>
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
    codeMode: boolean;
    setCodeMode: (code: boolean) => void;
    dataset: Dataset;
}

const DatasetInfoContent: React.FC<DatasetInfoContentProps> = ({isIn, codeMode, setCodeMode, dataset}) => {
    // const classes = useStyles();
    let content;
    if (codeMode) {
        content = (<code>{JSON.stringify(dataset, ['id', 'title', 'dimensions', 'bbox'], 2)}</code>);
    } else {
        const data: KeyValue[] = [
            ['Dimension Names', dataset.dimensions.map(d => d.name).join(', ')],
            ['Dimension Sizes', dataset.dimensions.map(d => d.size).join(', ')],
            ['Dimension Data Types', dataset.dimensions.map(d => d.dtype).join(', ')],
            ['Bounding Box', dataset.bbox.map(x => x + '').join(', ')],
        ];
        content = <KeyValueTable data={data}/>;
    }
    return (
        <InfoCardContent
            title={dataset.title}
            subheader={`${dataset.id}`}
            isIn={isIn}
            codeMode={codeMode}
            setCodeMode={setCodeMode}
        >
            {content}
        </InfoCardContent>
    );
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface VariableInfoContentProps {
    isIn: boolean;
    codeMode: boolean;
    setCodeMode: (code: boolean) => void;
    variable: Variable;
}

const VariableInfoContent: React.FC<VariableInfoContentProps> = ({isIn, codeMode, setCodeMode, variable}) => {
    // const classes = useStyles();
    let content;
    if (codeMode) {
        content = (
            <code>
                {JSON.stringify(variable,
                                ['id', 'name', 'title', 'units', 'shape', 'dtype', 'colorBarMin', 'colorBarMax', 'colorBarName'],
                                2)}
            </code>
        );
    } else {
        const data: KeyValue[] = [
            ['Name', variable.name],
            ['Title', variable.title],
            ['Units', variable.units],
            ['Shape', variable.shape],
            ['Data Type', variable.dtype],
            ['Default display min/max', `${variable.colorBarMin}, ${variable.colorBarMax}`],
            ['Default colour bar', variable.colorBarName],
        ];
        content = <KeyValueTable data={data}/>;
    }
    return (
        <InfoCardContent
            title={variable.name}
            subheader={`${variable.shape}`}
            isIn={isIn}
            codeMode={codeMode}
            setCodeMode={setCodeMode}
        >
            {content}
        </InfoCardContent>
    );
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface PlaceInfoContentProps {
    isIn: boolean;
    codeMode: boolean;
    setCodeMode: (code: boolean) => void;
    place: Place;
}

const PlaceInfoContent: React.FC<PlaceInfoContentProps> = ({isIn, codeMode, setCodeMode, place}) => {
    let content;
    if (codeMode) {
        content = <code>{JSON.stringify(place, null, 2)}</code>;
    } else {
        if (!!place.properties) {
            const data: KeyValue[] = Object.getOwnPropertyNames(place.properties).map(
                (name: any) => [name, place.properties![name]]
            );
            content = <KeyValueTable data={data}/>;
        } else {
            content = <Typography>This place has no properties.</Typography>;
        }
    }
    return (
        <InfoCardContent
            title={getPlaceLabel(place, DEFAULT_LABEL_PROPERTY_NAMES)}
            subheader={`Type: ${place.geometry.type}`}
            isIn={isIn}
            codeMode={codeMode}
            setCodeMode={setCodeMode}
        >
            {content}
        </InfoCardContent>
    );
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface InfoCardContentProps {
    isIn: boolean;
    title: React.ReactNode;
    subheader?: React.ReactNode;
    codeMode: boolean;
    setCodeMode: (code: boolean) => void;
}

const InfoCardContent: React.FC<InfoCardContentProps> = ({
                                                             isIn,
                                                             title,
                                                             subheader,
                                                             codeMode,
                                                             setCodeMode,
                                                             children,
                                                         }) => {
    // const classes = useStyles();

    const handleCodeModeClick = () => {
        setCodeMode(!codeMode);
    };

    return (
        <Collapse in={isIn} timeout="auto" unmountOnExit>
            <CardHeader
                title={title}
                subheader={subheader}
                action={
                    <IconButton onClick={handleCodeModeClick}>
                        {codeMode ? <TextFieldsIcon/> : <CodeIcon/>}
                    </IconButton>
                }
            />
            <CardContent>
                {children}
            </CardContent>
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
        <TableContainer component={Paper}>
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
