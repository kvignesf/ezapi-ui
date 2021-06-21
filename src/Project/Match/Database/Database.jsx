import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import _ from "lodash";

import { useGetTables } from "../../../shared/query/tablesQueries";
import LoaderWithMessage from "../../../shared/components/LoaderWithMessage";
import DatabaseSection from "./DatabaseSection";
import tableAtom from "../../../shared/atom/tableAtom";
import { isDatabase } from "../../../shared/utils";

const Database = () => {
  const { id: projectId } = useParams();
  const {
    isLoading: isFetchingTables,
    error: fetchTablesError,
    data: tablesData,
    mutate: fetchTablesData,
  } = useGetTables();
  const [firstPartContent, setFirstContent] = useState(null);
  const [secondPartContent, setSecondContent] = useState(null);
  const [thirdPartContent, setThirdContent] = useState(null);
  const [tableState, setTableState] = useRecoilState(tableAtom);

  useEffect(() => {
    fetchTablesData({ projectId });
  }, []);

  useEffect(() => {
    if (tableState?.selected) {
      const columnsData = _.cloneDeep(tableState?.selected?.data);

      const threePartIndex = Math.ceil(columnsData?.length / 3);

      const thirdPart = columnsData.splice(-threePartIndex);
      const secondPart = columnsData.splice(-threePartIndex);
      const firstPart = columnsData;

      setFirstContent(firstPart);
      setSecondContent(secondPart);
      setThirdContent(thirdPart);
    } else if (tablesData && !_.isEmpty(tablesData)) {
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

      setFirstContent(firstPart);
      setSecondContent(secondPart);
      setThirdContent(thirdPart);
    }
  }, [tablesData, tableState?.selected]);

  if (isFetchingTables) {
    return (
      <LoaderWithMessage
        message='Loading tables data'
        className='h-full'
        contained
      />
    );
  }

  if (!firstPartContent || _.isEmpty(firstPartContent)) {
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
            items={firstPartContent}
            onItemClick={(item) => {
              if (isDatabase(item)) {
                setTableState((tableState) => {
                  const clonedTableState = _.cloneDeep(tableState);

                  clonedTableState.selected = item;

                  return clonedTableState;
                });
              }
            }}
          />
        </div>

        <div className='flex-1 h-fit bg-neutral-gray7 rounded-md p-2 '>
          <DatabaseSection
            section={"2"}
            items={secondPartContent}
            onItemClick={(item) => {
              if (isDatabase(item)) {
                setTableState((tableState) => {
                  const clonedTableState = _.cloneDeep(tableState);

                  clonedTableState.selected = item;

                  return clonedTableState;
                });
              }
            }}
          />
        </div>

        <div className='flex-1 h-fit  bg-neutral-gray7 rounded-md p-2'>
          <DatabaseSection
            section={"3"}
            items={thirdPartContent}
            onItemClick={(item) => {
              if (isDatabase(item)) {
                setTableState((tableState) => {
                  const clonedTableState = _.cloneDeep(tableState);

                  clonedTableState.selected = item;

                  return clonedTableState;
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Database;
