import * as React from 'react';
import { WithStyles, createStyles, withStyles } from "@material-ui/core";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';

const styles = createStyles({
                                root: {
                                    width: '100%',
                                    overflowX: 'auto',
                                },
                                table: {
                                    minWidth: 700,
                                },
                            });

let id = 0;

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    id += 1;
    return {id, name, calories, fat, carbs, protein};
}

const data = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

interface SimpleTableProps extends WithStyles<typeof styles> {
}

class SimpleTable extends React.Component<SimpleTableProps>{
    render() {
        const {classes} = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Dessert (100g serving)</TableCell>
                            <TableCell align="right">Calories</TableCell>
                            <TableCell align="right">Fat (g)</TableCell>
                            <TableCell align="right">Carbs (g)</TableCell>
                            <TableCell align="right">Protein (g)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(n => (
                            <TableRow key={n.id}>
                                <TableCell component="th" scope="row">
                                    {n.name}
                                </TableCell>
                                <TableCell align="right">{n.calories}</TableCell>
                                <TableCell align="right">{n.fat}</TableCell>
                                <TableCell align="right">{n.carbs}</TableCell>
                                <TableCell align="right">{n.protein}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

export default withStyles(styles)(SimpleTable);
