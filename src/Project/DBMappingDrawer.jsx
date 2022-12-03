import React, { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import Colors from "../shared/colors";
import {
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Typography,
  TextField,
  makeStyles,
} from "@material-ui/core";
import AppIcon from "../shared/components/AppIcon";
import {
  PrimaryButton,
  TextButton,
  OutlineButton,
} from "../shared/components/AppButton";
import { getTablesRelations } from "./projectQueries";
import { Add, Delete } from "@material-ui/icons";
import { Stack } from "@mui/material";
import TabLabel from "../shared/components/TabLabel";
import ConfirmDialog from "../shared/components/ConfirmDialog";

const RelationTableRow = ({ data, tables, onUpdate, schema, onDelete }) => {
  const [mainTable, setMainTable] = useState(data?.mainTable ?? "");
  const [dependentTableSchema, setDependentTableSchema] = useState(data?.dependentTableSchema ?? "");
  const [mainTableSchema, setMainTableSchema] = useState(data?.mainTableSchema ?? "");
  const [dependentTable, setDependentTable] = useState(data?.dependentTable ?? "");
  const [dependentTableColumn, setDependentTableColumn] = useState(data?.dependentTableColumn ?? "");
  const [mainTableColumn, setMainTableColumn] = useState(data?.mainTableColumn ?? "");
  const [availableTable, setAvailableTable] = useState([]);
  const [availableTableColumn, setAvailableTableColumn] = useState([]);
  const [availableColumn, setAvailableColumn] = useState([]);
  /*const [availableSchemas, setavailableSchemas] = useState([]);
  useEffect(() => {
    let list = tables.map((a) => {
      return a.schema;
    });
    list = list.filter((x, i, a) => a.indexOf(x) === i);
    setavailableSchemas(list);
  }, [tables]);*/


  useEffect(() => {
    if (mainTable === "") {
      setDependentTable("");
      setDependentTableColumn("");
      setMainTableColumn("");
      setAvailableTable([]);
      setAvailableTableColumn([]);
      setAvailableColumn([]);
    } else {
      let tableData = [];
      tables.map((item) => {
        if (item.name !== mainTable) {
          tableData.push(item.name);
        } else {
          setAvailableColumn(item.data);
        }
      });
      setAvailableTable(tableData);
    }
  }, [mainTable, tables]);

  useEffect(() => {
    if (dependentTable !== "") {
      tables.map((item) => {
        if (item.name === dependentTable) {
          setAvailableTableColumn(item.data);
        }
      });
    }
  }, [dependentTable, tables]);

  useEffect(() => {
    const newdata = {
      mainTable: mainTable,
      mainTableColumn: mainTableColumn,
      dependentTable: dependentTable,
      dependentTableColumn: dependentTableColumn,
      relation: "equals",
      origin: data.origin,
      mainTableSchema: mainTableSchema,
      dependentTableSchema: dependentTableSchema,
    };

    onUpdate(newdata);
  }, [mainTable, mainTableColumn, dependentTable, dependentTableColumn, mainTableSchema, dependentTableSchema]);

  return (
    <TableRow>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
        }}
      >
        <Select
          required
          variant="outlined"
          value={mainTableSchema}
          onChange={({ target: { value } }) => {
            setMainTableSchema(value);
          }}
          style={{
            width: "100%",
            height: "40px",
          }}
        >
          {schema.map((value) => {
            return (
              <MenuItem value={value}>
                <p className="text-overline2">{value}</p>
              </MenuItem>
            );
          })}
        </Select>
      </TableCell>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
        }}
      >
        <Select
          required
          variant="outlined"
          value={mainTable}
          onChange={({ target: { value } }) => {
            setMainTable(value);
          }}
          style={{
            width: "100%",
            height: "40px",
          }}
        >
          {tables.map((value) => {
            return (
              <MenuItem value={value?.name}>
                <p className="text-overline2">{value?.name}</p>
              </MenuItem>
            );
          })}
        </Select>
      </TableCell>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
        }}
      >
        <Select
          required
          variant="outlined"
          value={mainTableColumn}
          onChange={({ target: { value } }) => {
            setMainTableColumn(value);
          }}
          style={{
            width: "100%",
            height: "40px",
          }}
        >
          {availableColumn.map((column) => {
            return (
              <MenuItem value={column?.name} key={column?.name}>
                <p className="text-overline2">{column?.name}</p>
              </MenuItem>
            );
          })}
        </Select>
      </TableCell>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
        }}
      >
        <Select
          required
          variant="outlined"
          value={dependentTableSchema}
          onChange={({ target: { value } }) => {
            setDependentTableSchema(value);
          }}
          style={{
            width: "100%",
            height: "40px",
          }}
        >
          {schema.map((value) => {
            return (
              <MenuItem value={value}>
                <p className="text-overline2">{value}</p>
              </MenuItem>
            );
          })}
        </Select>
      </TableCell>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
        }}
      >
        <Select
          required
          variant="outlined"
          value={dependentTable}
          onChange={({ target: { value } }) => {
            setDependentTable(value);
          }}
          style={{
            width: "100%",
            height: "40px",
          }}
          MenuProps={{
            style: {
              maxHeight: "500px",
            },
          }}
        >
          {availableTable.map((tableData) => {
            return (
              <MenuItem value={tableData} key={tableData}>
                <p className="text-overline2">{tableData}</p>
              </MenuItem>
            );
          })}
        </Select>
      </TableCell>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
        }}
      >
        <Select
          required
          variant="outlined"
          value={dependentTableColumn}
          onChange={({ target: { value } }) => {
            setDependentTableColumn(value);
          }}
          style={{
            width: "100%",
            height: "40px",
          }}
        >
          {availableTableColumn.map((column) => {
            return (
              <MenuItem value={column?.name}>
                <p className="text-overline2">{column?.name}</p>
              </MenuItem>
            );
          })}
        </Select>
      </TableCell>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
          width: "100px",
        }}
      >
        <p className="text-overline2">{data?.origin ?? ""}</p>
      </TableCell>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
        }}
      >
        <Delete
          color={data?.origin === "derived" ? "disabled" : "error"}
          onClick={() => {
            if (data?.origin !== "derived") {
                onDelete();
            }
          }}
        />
      </TableCell>
    </TableRow>
  );
};

const FilterTableRow = ({ data, tables, schema, onUpdate, onDelete }) => {
  const [schemaName, setSchemaName] = useState(data?.schemaName ?? "");
  const [tableName, setTableName] = useState(data?.tableName ?? "");
  const [columnName, setColumnName] = useState(data?.columnName ?? "");  
  const [availableColumn, setAvailableColumn] = useState([]);
  const [filterCondition, setFilterCondition] = useState(data?.filterCondition ?? "");
  const [value, setValue] = useState(data?.value ?? "");

  /*const [availableSchemas, setavailableSchemas] = useState([]);
  useEffect(() => {
    let list = tables.map((a) => {
      return a.schema;
    });
    list = list.filter((x, i, a) => a.indexOf(x) === i);
    setavailableSchemas(list);
  }, [tables]);*/

  useEffect(() => {
    if (tableName === "") {
      setColumnName("");
      setAvailableColumn([]);
    } else {
      tables.map((item) => {
        if (item.name == tableName) {
          setAvailableColumn(item.data);
        }
      });
    }
  }, [tableName, tables]);

  useEffect(() => {
    const newdata = {
      schemaName: schemaName,
      tableName: tableName,
      columnName: columnName,
      filterCondition: filterCondition,
      value: value,
    };

    onUpdate(newdata);
  }, [tableName, columnName, filterCondition, value, schemaName]);

  return (
    <TableRow>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
        }}
      >
        <Select
          required
          variant="outlined"
          value={schemaName}
          onChange={({ target: { value } }) => {
            setSchemaName(value);
          }}
          style={{
            width: "100%",
            height: "40px",
          }}
        >
          {schema.map((value) => {
            return (
              <MenuItem value={value}>
                <p className="text-overline2">{value}</p>
              </MenuItem>
            );
          })}
        </Select>
      </TableCell>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
        }}
      >
        <Select
          required
          variant="outlined"
          value={tableName}
          onChange={({ target: { value } }) => {
            setTableName(value);
          }}
          style={{
            width: "100%",
            height: "40px",
          }}
        >
          {tables.map((value) => {
            return (
              <MenuItem value={value?.name}>
                <p className="text-overline2">{value?.name}</p>
              </MenuItem>
            );
          })}
        </Select>
      </TableCell>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
        }}
      >
        <Select
          required
          variant="outlined"
          value={columnName}
          onChange={({ target: { value } }) => {
            setColumnName(value);
          }}
          style={{
            width: "100%",
            height: "40px",
          }}
        >
          {availableColumn.map((column) => {
            return (
              <MenuItem value={column?.name}>
                <p className="text-overline2">{column?.name}</p>
              </MenuItem>
              
            );
          })}
        </Select>
      </TableCell>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
        }}
      >
        <Select
          required
          variant="outlined"
          value={filterCondition}
          onChange={({ target: { value } }) => {
            setFilterCondition(value);
          }}
          style={{
            width: "100%",
            height: "40px",
          }}
          MenuProps={{
            style: {
              maxHeight: "500px",
            },
          }}
        >
          <MenuItem value={"equals"}>
            <p className="text-overline2">=</p>
          </MenuItem>
          <MenuItem value={"not equals"}>
            <p className="text-overline2">≠</p>
          </MenuItem>
          <MenuItem value={"greater than"}>
            <p className="text-overline2">{">"}</p>
          </MenuItem>
          <MenuItem value={"less than"}>
            <p className="text-overline2">{"<"}</p>
          </MenuItem>
        </Select>
      </TableCell>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
        }}
      >
        <TextField
          variant="outlined"
          value={value}
          onChange={({ target: { value } }) => {
            setValue(value);
          }}
          size="small"
        />
      </TableCell>
      <TableCell
        align="left"
        style={{
          padding: "0.5rem",
        }}
      >
        <Delete
          color="error"
          onClick={() => {
            onDelete();
          }}
        />
      </TableCell>
    </TableRow>
  );
};

const tabsStyles = makeStyles({
  indicator: {
    top: "0px",
  },
});

const tabStyles = makeStyles({
  tab: {
    background: Colors.neutral.gray7,
    "&.Mui-selected": {
      background: "white",
    },
  },
});

const DBMappingDrawer = ({ projectId, onClose, onSubmit, tablesData }) => {
  const [isFilter, setIsFilter] = useState(0);
  const [tablesRelation, setTablesRelation] = useState([]);
  const [dummyTables, setDummyTables] = useState();
  const [tablesFilter, setTablesFilter] = useState([]);
  const tabsClasses = tabsStyles();
  const tabClasses = tabStyles();
  const [operationDataTables, setOperationDataTables] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(true);
  const [emptyError, setEmptyError] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [displayPopUp, setDisplayPopUp] = useState(false);
  const [schemaValues, setSchemaValues] = useState([]);


  useEffect(() => {
    let filterCheck = false;
    let relationCheck = false;
    tablesRelation.map((relation) => {
      let count = 0;
      if (
        relation.mainTable === "" ||
        relation.mainTableColumn === "" ||
        relation.dependentTable === "" ||
        relation.dependentTableColumn === ""
      ) {
        setEmptyError(true);
        relationCheck = true;
      } else {
        setEmptyError(false);
      }

      tablesRelation.map((item) => {
        if (
          item.mainTable === relation.mainTable &&
          item.mainTableColumn === relation.mainTableColumn &&
          item.dependentTable === relation.dependentTable &&
          item.dependentTableColumn === relation.dependentTableColumn
        ) {
          count++;
        }

        if (
          item.mainTable === relation.dependentTable &&
          item.mainTableColumn === relation.dependentTableColumn &&
          item.dependentTable === relation.mainTable &&
          item.dependentTableColumn === relation.mainTableColumn &&
          item.mainTable !== ""
        ) {
          count++;
        }
      });

      if (count > 1) {
        relationCheck = true;
        setDuplicateError(true);
      } else {
        setDuplicateError(false);
      }
    });

    tablesFilter.map((filter) => {
      let count = 0;

      if (
        filter.tableName === "" ||
        filter.columnName === "" ||
        filter.value === "" ||
        filter.filterCondition === ""
      ) {
        filterCheck = true;
        setEmptyError(true);
      } else {
        setEmptyError(false);
      }

      tablesFilter.map((item) => {
        if (
          item.tableName === filter.tableName &&
          item.columnName === filter.columnName
        ) {
          count++;
        }
      });

      if (count > 1) {
        filterCheck = true;
        setDuplicateError(true);
      } else {
        setDuplicateError(false);
      }
    });

    setDisableButton(filterCheck || relationCheck);
  }, [triggerUpdate]);

  useEffect(() => {
    if (tablesData) {
      let schemaArray = [];
      const newData = tablesData.map((item) => {
        const temp = item.name;
        const arr = temp.split(".");
        if (arr[1]) {
          item.name = arr[1];
          schemaArray.push(arr[0]);
        }
        return item;
      });
      schemaArray = schemaArray.filter((x, i, a) => a.indexOf(x) === i);
      setSchemaValues(schemaArray);

      setOperationDataTables(newData);
    }
  }, [tablesData]);

  const prepareData = async () => {
    const data = await getTablesRelations(projectId);

    if (data) {
      setTablesFilter(data.filters ?? []);
      setTablesRelation(data.relations ?? []);
    }

    if (tablesData) {
      setOperationDataTables(tablesData);
    }
  };

  const handleChange = (event, newValue) => {
    setIsFilter(newValue);
  };

  useEffect(() => {
    if (projectId) {
      prepareData();
    }
  }, [projectId]);

  return (
    <>
      {displayPopUp && (
        <ConfirmDialog
          title={"Delete Mapping"}
          description={
            "Are you sure you want to delete this row? Once Deleted you cant get it back."
          }
          onCancel={() => {
            setDisplayPopUp(false);
          }}
          onConfirm={() => {
            if (dummyTables?.isRelation) {
              setTablesRelation(dummyTables.filteredList);
            } else {
              setTablesFilter(dummyTables.filteredList);
            }
            setTriggerUpdate((oldValue) => !oldValue);
            setDisplayPopUp(false);
          }}
        />
      )}
      <div
        style={{ width: `80vw`, height: "100%", maxWidth: "1400px" }}
        className="flex flex-col"
      >
        <div className="p-4 border-b-1 flex flex-row justify-between">
          <p className="text-subtitle1">Entity Mapping</p>
          <AppIcon onClick={onClose}>
            <CloseIcon />
          </AppIcon>
        </div>

        <div className="w-full flex-1">
          <div className="p-4">
            <TableContainer
              style={{ maxHeight: `calc(100vh - 160px)` }}
              className="border-2 rounded-md"
            >
              <Stack
                direction={"row"}
                justifyContent="space-between"
                sx={{
                  bgcolor: "#F9FAFC",
                }}
                alignItems="center"
              >
                <Tabs
                  classes={{
                    indicator: tabsClasses.indicator,
                  }}
                  value={isFilter}
                  onChange={handleChange}
                  aria-label="add project tabs"
                  indicatorColor="primary"
                  textColor="primary"
                  style={{ width: "min-content" }}
                >
                  <Tab
                    label={<TabLabel label={"Relations / Joins"} />}
                    classes={{ root: tabClasses.tab }}
                    style={{
                      borderRight: `2px solid ${Colors.neutral.gray6}`,
                      outline: "none",
                    }}
                  />

                  <Tab
                    label={<TabLabel label={"Filters"} />}
                    classes={{ root: tabClasses.tab }}
                    style={{
                      outline: "none",
                      borderRight: `2px solid ${Colors.neutral.gray6}`,
                    }}
                  />
                </Tabs>

                <OutlineButton
                  style={{ height: "35px", marginRight: "5px" }}
                  onClick={() => {
                    if (isFilter) {
                      const data = {
                        tableName: "",
                        columnName: "",
                        filterCondition: "",
                        schemaName: "",
                        value: "",
                      };
                      setTablesFilter([...tablesFilter, data]);
                    } else {
                      const data = {
                        mainTable: "",
                        mainTableColumn: "",
                        dependentTable: "",
                        dependentTableColumn: "",
                        relation: "equals",
                        origin: "userInput",
                        mainTableSchema: "",
                        dependentTableSchema: "",
                      };
                      setTablesRelation([...tablesRelation, data]);
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Add fontSize="small" />
                    <Typography variant="subtitle2">
                      {!isFilter ? "Add Mapping" : "Add Filter"}
                    </Typography>
                  </Stack>
                </OutlineButton>
              </Stack>
              <Table stickyHeader aria-label="simple table">
                {!isFilter ? (
                  <TableHead className="w-full">
                    <TableRow>
                      <TableCell align="left" style={{ padding: "0.5rem" }}>
                        <p className="text-smallLabel text-neutral-gray4 uppercase">
                          MAIN TABLE SCHEMA
                        </p>
                      </TableCell>
                      <TableCell align="left" style={{ padding: "0.5rem" }}>
                        <p className="text-smallLabel text-neutral-gray4 uppercase">
                          MAIN TABLE
                        </p>
                      </TableCell>
                      <TableCell align="left" style={{ padding: "0.5rem" }}>
                        <p className="text-smallLabel text-neutral-gray4 uppercase">
                          MAIN TABLE COLUMN
                        </p>
                      </TableCell>
                      <TableCell align="left" style={{ padding: "0.5rem" }}>
                        <p className="text-smallLabel text-neutral-gray4 uppercase">
                          DEPENDENT TABLE SCHEMA
                        </p>
                      </TableCell>
                      <TableCell align="left" style={{ padding: "0.5rem" }}>
                        <p className="text-smallLabel text-neutral-gray4 uppercase">
                          DEPENDENT TABLE
                        </p>
                      </TableCell>
                      <TableCell align="left" style={{ padding: "0.5rem" }}>
                        <p className="text-smallLabel text-neutral-gray4 uppercase">
                          DEPENDENT TABLE COLUMN
                        </p>
                      </TableCell>
                      <TableCell align="left" style={{ padding: "0.5rem" }}>
                        <p className="text-smallLabel text-neutral-gray4 uppercase">
                          ORIGIN
                        </p>
                      </TableCell>
                      <TableCell align="left" style={{ padding: "0.5rem" }}>
                        <p className="text-smallLabel text-neutral-gray4 uppercase"></p>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                ) : (
                  <TableHead className="w-full">
                    <TableCell align="left" style={{ padding: "0.5rem" }}>
                      <p className="text-smallLabel text-neutral-gray4 uppercase">
                        SCHEMA NAME
                      </p>
                    </TableCell>
                    <TableCell align="left" style={{ padding: "0.5rem" }}>
                      <p className="text-smallLabel text-neutral-gray4 uppercase">
                        TABLE NAME
                      </p>
                    </TableCell>
                    <TableCell align="left" style={{ padding: "0.5rem" }}>
                      <p className="text-smallLabel text-neutral-gray4 uppercase">
                        COLUMN NAME
                      </p>
                    </TableCell>
                    <TableCell align="left" style={{ padding: "0.5rem" }}>
                      <p className="text-smallLabel text-neutral-gray4 uppercase">
                        FILTER CONDITION
                      </p>
                    </TableCell>
                    <TableCell align="left" style={{ padding: "0.5rem" }}>
                      <p className="text-smallLabel text-neutral-gray4 uppercase">
                        VALUE
                      </p>
                    </TableCell>
                    <TableCell align="left" style={{ padding: "0.5rem" }}>
                      <p className="text-smallLabel text-neutral-gray4 uppercase"></p>
                    </TableCell>
                  </TableHead>
                )}

                {!isFilter
                  ? tablesRelation?.map((data, index) => (
                      <RelationTableRow
                        key={data?.mainTable + data?.dependentTable + index}
                        data={data}
                        tables={operationDataTables}
                        schema={schemaValues}
                        onUpdate={(newdata) => {
                          tablesRelation[index] = newdata;
                          setTriggerUpdate((oldValue) => !oldValue);
                        }}
                        onDelete={() => {
                          setDisplayPopUp(true);
                          const filteredList = tablesRelation.filter((item) => {
                            if (item !== tablesRelation[index]) {
                              return item;
                            }
                          });
                          //setTablesRelation(filteredList);
                          //setTriggerUpdate((oldValue) => !oldValue);
                          setDummyTables({
                            filteredList: filteredList,
                            isRelation: true,
                          });
                        }}
                      />
                    ))
                  : tablesFilter?.map((data, index) => (
                      <FilterTableRow
                        key={data?.tableName + data?.columnName + index}
                        data={data}
                        tables={operationDataTables}
                        schema={schemaValues}
                        onUpdate={(newdata) => {
                          tablesFilter[index] = newdata;
                          setTriggerUpdate((oldValue) => !oldValue);
                        }}
                        onDelete={() => {
                          setDisplayPopUp(true);
                          const filteredList = tablesFilter.filter((item) => {
                            if (item !== tablesFilter[index]) {
                              return item;
                            }
                          });
                          //setTablesFilter(filteredList);
                          //setTriggerUpdate((oldValue) => !oldValue);
                          setDummyTables({
                            filteredList: filteredList,
                            isRelation: false,
                          });
                        }}
                      />
                    ))}
              </Table>
            </TableContainer>
          </div>
          {/* )} */}
        </div>
        <div className="pl-6 pb-5">
          {emptyError && (
            <p className="text-overline2 text-accent-red my-2">
            Fill all fields
          </p>
          )}
          {duplicateError && (
            <p className="text-overline2 text-accent-red my-2">
              Remove duplicate values
            </p>
          )}
        </div>

        <div className="p-4 border-t-1 flex flex-row justify-between">
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
            disabled={disableButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!disableButton) {
                const mappedData = {
                  projectId: projectId,
                  filters: tablesFilter,
                  relations: tablesRelation,
                };
                onSubmit(mappedData);
                onClose();
              }
            }}
          >
            Save and Publish
          </PrimaryButton>
        </div>
      </div>
    </>
  );
};

export default DBMappingDrawer;
