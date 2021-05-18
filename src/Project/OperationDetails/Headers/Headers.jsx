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
import DropArea from "../DropArea";
import _ from "lodash";

const Headers = () => {
  const [items, setItems] = useState([]);

  return (
    <div>
      <DropArea
        onItemDropped={(item) => {
          console.log("item", item);
          setItems([...items, item]);
        }}
      >
        <TableContainer>
          <Table aria-label='simple table' className='border-t-2 border-b-2'>
            <TableHead className='border-t-2 border-b-2'>
              <TableRow>
                <TableCell align='center' style={{ padding: "0.5rem" }}>
                  <p className='text-overline2 text-neutral-gray4'>ATTRIBUTE</p>
                </TableCell>
                <TableCell align='center' style={{ padding: "0" }}>
                  <p className='text-overline2 text-neutral-gray4'>DATA TYPE</p>
                </TableCell>
                <TableCell align='center' style={{ padding: "0" }}>
                  <p className='text-overline2 text-neutral-gray4'>
                    DESCRIPTION
                  </p>
                </TableCell>
                <TableCell align='center' style={{ padding: "0" }}>
                  <p className='text-overline2 text-neutral-gray4'>REQUIRED</p>
                </TableCell>
                <TableCell align='center' style={{ padding: "0" }}>
                  <p className='text-overline2 text-neutral-gray4'>
                    POSSIBLE VALUES
                  </p>
                </TableCell>
              </TableRow>
            </TableHead>

            {!_.isEmpty(items) && (
              <TableBody className='w-full' colspan={5}>
                {items.length}
              </TableBody>
            )}
          </Table>
        </TableContainer>

        {_.isEmpty(items) && <div>empty boss</div>}
      </DropArea>
    </div>
  );
};

export default Headers;
