import IconButton from '@material-ui/core/IconButton';
import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import WidgetsIcon from '@material-ui/icons/Widgets';
import LayersIcon from '@material-ui/icons/Layers';
import PlaceIcon from '@material-ui/icons/Place';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: Theme) => {
    return createStyles(
        {
            card: {
                maxWidth: '100%',
            },
            media: {
                height: 0,
                paddingTop: '56.25%', // 16:9
            },
            expand: {
                transform: 'rotate(0deg)',
                marginLeft: 'auto',
                transition: theme.transitions.create('transform', {
                    duration: theme.transitions.duration.shortest,
                }),
            },
            expandOpen: {
                transform: 'rotate(180deg)',
            },
            avatar: {
                backgroundColor: red[500],
            },
        }
    );
});

interface InfoCardProps {
    infoCardOpen: boolean;
    showInfoCard: (infoCardOpen: boolean) => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
                                               infoCardOpen,
                                               showInfoCard,
                                           }) => {

    const classes = useStyles();
    const [infoElements, setInfoElements] = useState<string[]>(["dataset", "variable", "place"]);

    if (!infoCardOpen) {
        return null;
    }

    const handleInfoElementsChanges = (event: React.MouseEvent<HTMLElement>, value: any) => {
        setInfoElements(value);
    };

    const handleInfoCardClose = () => {
        showInfoCard(false);
    };

    const actions = [
        <ToggleButtonGroup key={0} size="small" value={infoElements} onChange={handleInfoElementsChanges}>
            <ToggleButton key={0} value="dataset">
                <WidgetsIcon/>
            </ToggleButton>
            <ToggleButton key={1} value="variable">
                <LayersIcon/>
            </ToggleButton>
            <ToggleButton key={2} value="place">
                <PlaceIcon/>
            </ToggleButton>
        </ToggleButtonGroup>,
        <IconButton key={1} onClick={handleInfoCardClose}>
            {<CloseIcon/>}
        </IconButton>,
    ];

    return (
        <Card className={classes.card}>
            <CardHeader
                title="Information"
                subheader={infoElements.join(' - ')}
                action={actions}
            />
            <Collapse in={infoElements.includes('dataset')} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Dataset:</Typography>
                    <Typography paragraph>
                        Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                        minutes.
                    </Typography>
                </CardContent>
            </Collapse>
            <Collapse in={infoElements.includes('variable')} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Variable:</Typography>
                    <Typography paragraph>
                        Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                        heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                        browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                        and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                        pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                        saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                    </Typography>
                </CardContent>
            </Collapse>
            <Collapse in={infoElements.includes('place')} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Place:</Typography>
                    <Typography paragraph>
                        Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                        without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                        medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                        again without stirring, until mussels have opened and rice is just tender, 5 to 7
                        minutes more. (Discard any mussels that don’t open.)
                    </Typography>
                    <Typography>
                        Set aside off of the heat to let rest for 10 minutes, and then serve.
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default InfoCard;