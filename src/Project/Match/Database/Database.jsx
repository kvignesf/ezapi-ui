import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import _ from "lodash";

import { useGetTables } from "../../../shared/query/tablesQueries";
import LoaderWithMessage from "../../../shared/components/LoaderWithMessage";
import DatabaseSection from "./DatabaseSection";
import tableAtom from "../../../shared/atom/tableAtom";

const Database = () => {
  const { id: projectId } = useParams();
  const {
    isLoading: isFetchingTables,
    error: fetchTablesError,
    data: tablesData,
    mutate: fetchTablesData,
  } = useGetTables();
  const [firstPartTables, setFirstTables] = useState(null);
  const [secondPartTables, setSecondTables] = useState(null);
  const [thirdPartTables, setThirdTables] = useState(null);
  const [tableState, setTableState] = useRecoilState(tableAtom);

  useEffect(() => {
    fetchTablesData({ projectId });
  }, []);

  useEffect(() => {
    if (tablesData && !_.isEmpty(tablesData)) {
      const clonedTablesData = _.cloneDeep(tablesData);

      clonedTablesData?.sort((a, b) => {
        if (a?.data?.length < b?.data?.length) return 1;
        if (a?.data?.length > b?.data?.length) return -1;
        return 0;
      });

      const threePartIndex = Math.ceil(clonedTablesData.length / 3);

      const thirdPart = clonedTablesData.splice(-threePartIndex);
      const secondPart = clonedTablesData.splice(-threePartIndex);
      const firstPart = clonedTablesData;

      setFirstTables(firstPart);
      setSecondTables(secondPart);
      setThirdTables(thirdPart);
    }
  }, [tablesData]);

  if (isFetchingTables) {
    return (
      <LoaderWithMessage
        message='Loading tables data'
        className='h-full'
        contained
      />
    );
  }

  if (!firstPartTables || _.isEmpty(firstPartTables)) {
    return (
      <div>
        <p>No items available</p>
      </div>
    );
  }

  return (
    <div className='mx-4 py-4'>
      <div className='flex flex-row gap-x-5 justify-center'>
        <div className='flex-1 h-fit bg-neutral-gray7 rounded-md p-2'>
          <DatabaseSection
            section={"1"}
            items={firstPartTables}
            onItemClick={(table) => {
              setTableState((tableState) => {
                const clonedTableState = _.cloneDeep(tableState);

                clonedTableState.selected = table;

                return clonedTableState;
              });
            }}
          />
        </div>

        <div className='flex-1 h-fit bg-neutral-gray7 rounded-md p-2 '>
          <DatabaseSection
            section={"2"}
            items={secondPartTables}
            onItemClick={(table) => {
              setTableState((tableState) => {
                const clonedTableState = _.cloneDeep(tableState);

                clonedTableState.selected = table;

                return clonedTableState;
              });
            }}
          />
        </div>

        <div className='flex-1 h-fit  bg-neutral-gray7 rounded-md p-2'>
          <DatabaseSection
            section={"3"}
            items={thirdPartTables}
            onItemClick={(table) => {
              setTableState((tableState) => {
                const clonedTableState = _.cloneDeep(tableState);

                clonedTableState.selected = table;

                return clonedTableState;
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Database;
