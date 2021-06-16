import React, { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { useRecoilValue } from "recoil";
import _ from "lodash";
import classNames from "classnames";
import Select from "@material-ui/core/Select";
import {
  CircularProgress,
  MenuItem,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { useParams } from "react-router";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Scrollbar from "react-smooth-scrollbar";
import { useHistory } from "react-router-dom";

import AppIcon from "../../shared/components/AppIcon";
import { PrimaryButton, TextButton } from "../../shared/components/AppButton";
import {
  useGetTables,
  useGetSchemaRecommendations,
} from "./schemaRecommendationQuery";

const SchemaDetails = ({ schema, onClose }) => {
  const history = useHistory();
  const { id: projectId } = useParams();
  const {
    isLoading: isFetchingTables,
    data: tablesData,
    error: fetchTablesError,
    mutate: fetchTables,
  } = useGetTables();
  const {
    isLoading: isFetchingSchemaData,
    data: schemaData,
    error: fetchSchemaError,
    mutate: fetchSchemaData,
  } = useGetSchemaRecommendations();

  useEffect(() => {
    if (schema && schema?.name) {
      fetchTables({ projectId });
      fetchSchemaData({
        projectId,
        schema: schema?.name,
      });
    } else {
      history.goBack();
    }
  }, []);

  const getLoadingMessage = () => {
    if (isFetchingSchemaData) {
      return "Fetching schema data";
    } else if (isFetchingTables) {
      return "Fetching tables data";
    }
    return null;
  };

  const getErrorMessage = () => {
    if (fetchSchemaError) {
      return fetchSchemaError?.message;
    } else if (fetchTablesError) {
      return fetchTablesError?.message;
    }
    return null;
  };

  return (
    <div
      style={{ width: `80vw`, height: "100%", maxWidth: "900px" }}
      className='flex flex-col'
    >
      <div className='p-4 border-b-1 flex flex-row justify-between'>
        <p className='text-subtitle1'>Schema Details</p>
        <AppIcon onClick={onClose}>
          <CloseIcon />
        </AppIcon>
      </div>

      <div className='w-full flex-1'>
        {schemaData &&
          !_.isEmpty(schemaData) &&
          !getLoadingMessage() &&
          !getErrorMessage() && (
            <div className='p-4'>
              <TableContainer
                style={{ maxHeight: `calc(100vh - 160px)` }}
                className='border-2 rounded-md'
              >
                <Table stickyHeader aria-label='simple table'>
                  <TableHead className='w-full'>
                    <TableRow>
                      <TableCell align='left' style={{ padding: "0.5rem" }}>
                        <p className='text-smallLabel text-neutral-gray4 uppercase'>
                          attribute
                        </p>
                      </TableCell>
                      <TableCell align='left' style={{ padding: "0" }}>
                        <p className='text-smallLabel text-neutral-gray4 uppercase'>
                          path
                        </p>
                      </TableCell>
                      <TableCell
                        align='left'
                        style={{
                          padding: "0",
                        }}
                      >
                        <p className='text-smallLabel text-neutral-gray4 uppercase'>
                          table
                        </p>
                      </TableCell>
                      <TableCell align='left' style={{ padding: "0" }}>
                        <p className='text-smallLabel text-neutral-gray4 uppercase'>
                          column
                        </p>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  {schemaData?.map((attribute) => {
                    return (
                      <SchemaDetailsRow
                        attribute={attribute}
                        tablesData={tablesData}
                      />
                    );
                  })}
                </Table>
              </TableContainer>
            </div>
          )}

        {!schemaData ||
          (_.isEmpty(schemaData) && (
            <div className='h-full flex flex-col items-center justify-center'>
              <p className='text-overline2'>No schema data available</p>
            </div>
          ))}

        {getLoadingMessage() && (
          <div className='h-full flex flex-col items-center justify-center'>
            <CircularProgress
              style={{ width: "28px", height: "28px", marginBottom: "1rem" }}
            />
            <p className='text-overline2'>{getLoadingMessage()}</p>
          </div>
        )}

        {getErrorMessage() && (
          <div className='h-full flex flex-col items-center justify-center'>
            <p className='text-overline2'>{getErrorMessage()}</p>
          </div>
        )}
      </div>

      <div className='p-4 border-t-1 flex flex-row justify-between'>
        <TextButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            onClose();
          }}
        >
          Cancel
        </TextButton>
        <PrimaryButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            // saveAttributeData(table, column);
          }}
        >
          Save
        </PrimaryButton>
      </div>
    </div>
  );
};

const SchemaDetailsRow = ({ attribute, tablesData }) => {
  const [table, setTable] = useState(null); // table name
  const [column, setColumn] = useState(null); // column name

  const getColumns = (tableName) => {
    return _.find(tablesData, (tab) => tab?.table === tableName)?.columns ?? [];
  };

  return (
    <TableRow>
      <TableCell
        align='left'
        style={{
          paddingTop: "1.25rem",
          paddingBottom: "1.25rem",
          paddingLeft: "0.5rem",
          paddingRight: "0",
          width: "25%",
        }}
      >
        {attribute?.name}
      </TableCell>
      <TableCell
        align='left'
        style={{
          padding: "0",
          width: "25%",
        }}
      >
        <p className='text-overline2'>{attribute?.path}</p>
      </TableCell>
      <TableCell
        align='left'
        style={{
          padding: "0",
          width: "25%",
          paddingRight: "0.5rem",
        }}
      >
        <Select
          labelId={`${attribute?.name}-table`}
          id={`${attribute?.name}-table`}
          value={table}
          variant='outlined'
          onChange={(event) => {
            const value = event?.target?.value;

            if (value && !_.isEmpty(value)) {
              if (value?.includes("$$$")) {
                // Recommended value is selected

                setTable(value?.split("$$$")[0]);
                setColumn(value?.split("$$$")[1]);
              } else {
                // Table is selected

                setTable(value);
                setColumn(null);
              }
            }
          }}
          style={{
            width: "100%",
            height: "50px",
          }}
          MenuProps={{
            style: {
              maxHeight: "500px",
            },
          }}
        >
          <p className='text-capitalised text-brand-primary p-4 py-2'>
            Recommended
          </p>
          {attribute?.recommendations?.map((recom) => {
            return (
              <MenuItem value={`${recom?.table}$$$${recom?.table_attribute}`}>
                <p className='text-overline2'>
                  {recom?.table} / {recom?.table_attribute}
                </p>
              </MenuItem>
            );
          })}
          <div
            className='bg-neutral-gray7 my-2'
            style={{ height: "1px" }}
          ></div>
          {tablesData?.map((table) => {
            return (
              <MenuItem value={table?.table}>
                <p className='text-overline2'>{table?.table}</p>
              </MenuItem>
            );
          })}
        </Select>
      </TableCell>
      <TableCell
        align='left'
        style={{
          padding: "0",
          width: "25%",
          paddingRight: "0.5rem",
        }}
      >
        <Select
          labelId={`${attribute?.name}-column`}
          id={`${attribute?.name}-column`}
          value={column}
          variant='outlined'
          onChange={({ target: { value } }) => {
            // resetSaveAttrDetails();
            setColumn(value);
          }}
          style={{
            width: "100%",
            height: "50px",
          }}
        >
          {getColumns(table)?.map((column) => {
            return (
              <MenuItem value={column?.name}>
                <p className='text-overline2'>{column?.name}</p>
              </MenuItem>
            );
          })}
        </Select>
      </TableCell>
    </TableRow>
  );
};

export default SchemaDetails;
