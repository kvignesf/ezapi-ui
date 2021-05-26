import React, { useState } from "react";
import { Droppable } from "react-drag-and-drop";
import { useRecoilState, useRecoilValue } from "recoil";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core";
import _ from "lodash";
import produce from "immer";

import DropArea from "../DropArea";
import operationAtom from "../../operationAtom";

const Headers = () => {
  const [operationDetails, setOperationDetails] = useRecoilState(operationAtom);

  console.log("operationDetails", operationDetails?.operationRequest?.headers);

  return (
    <div>
      <DropArea
        onItemDropped={(item) => {
          if (
            item?.type !== "array" &&
            item?.type !== "ref" &&
            !item?.attributes &&
            !item?.refs
          ) {
            console.log("before", operationDetails?.operationRequest?.headers);
            const nextState = produce(operationDetails, (draftState) => {
              draftState.operationRequest.headers = [
                ...draftState.operationRequest.headers,
                {
                  name: item?.name,
                  type: item?.type,
                  required: item?.required,
                },
              ];

              console.log("drafting", draftState?.operationRequest?.headers);
            });

            console.log("after", nextState?.operationRequest?.headers);

            setOperationDetails(nextState);
          }
        }}
      >
        <TableContainer>
          <Table aria-label='simple table' className='border-t-2 border-b-2'>
            <TableHead className='border-t-2 border-b-2'>
              <TableRow>
                <TableCell align='left' style={{ padding: "0.5rem" }}>
                  <p className='text-overline2 text-neutral-gray4'>ATTRIBUTE</p>
                </TableCell>
                <TableCell align='left' style={{ padding: "0" }}>
                  <p className='text-overline2 text-neutral-gray4'>DATA TYPE</p>
                </TableCell>
                <TableCell align='left' style={{ padding: "0" }}>
                  <p className='text-overline2 text-neutral-gray4'>
                    DESCRIPTION
                  </p>
                </TableCell>
                <TableCell align='left' style={{ padding: "0" }}>
                  <p className='text-overline2 text-neutral-gray4'>REQUIRED</p>
                </TableCell>
                <TableCell align='left' style={{ padding: "0" }}>
                  <p className='text-overline2 text-neutral-gray4'>
                    POSSIBLE VALUES
                  </p>
                </TableCell>
              </TableRow>
            </TableHead>

            {!_.isEmpty(operationDetails?.operationRequest?.headers) && (
              <TableBody className='w-full'>
                {operationDetails?.operationRequest?.headers?.map((row) => {
                  return (
                    <TableRow key={row.name}>
                      <TableCell align='left'>{row.name}</TableCell>
                      <TableCell align='left'>{row.type}</TableCell>
                      <TableCell align='left'></TableCell>
                      <TableCell align='left'></TableCell>
                      <TableCell align='left'></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </TableContainer>

        {_.isEmpty(operationDetails?.operationRequest?.headers) && (
          <div>empty boss</div>
        )}
      </DropArea>
    </div>
  );
};

export default Headers;
