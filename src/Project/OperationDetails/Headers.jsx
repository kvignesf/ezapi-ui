import React, { useState } from "react";
import { Droppable } from "react-drag-and-drop";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core";
import DropArea from "./DropArea";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Headers = () => {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  return (
    <div>
      <TableContainer component={Paper}>
        <DropArea>
          <Table className={classes.table} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align='right'>Calories</TableCell>
                <TableCell align='right'>Fat&nbsp;(g)</TableCell>
                <TableCell align='right'>Carbs&nbsp;(g)</TableCell>
                <TableCell align='right'>Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>

            {<TableBody></TableBody>}
          </Table>
        </DropArea>
      </TableContainer>
    </div>
  );
};

export default Headers;
