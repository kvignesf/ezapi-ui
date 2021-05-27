import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import _ from "lodash";
import { useRecoilState } from "recoil";

import FullMatch from "./FullMatch";
import PartialMatch from "./PartialMatch";
import NoMatch from "./NoMatch";
import { useGetAllSchemas, useGetSubSchema } from "./schemaQueries";
import LoaderWithMessage from "../../../shared/components/LoaderWithMessage";
import schemaAtom from "./schemaAtom";
import {
  isArray,
  isFullMatch,
  isNoMatch,
  isPartialMatch,
  isSchema,
} from "../../../shared/utils";

const Schema = () => {
  const { id: projectId } = useParams();
  const [schemaState, setSchemaState] = useRecoilState(schemaAtom);
  const [schemaData, setSchemaData] = useState(null);
  const {
    isLoading,
    error: getAllSchemasError,
    data: allSchemaData,
    mutate: getAllSchemas,
  } = useGetAllSchemas();
  const {
    isLoading: isLoadingSubSchema,
    error: getSubSchemasError,
    data: subSchemaData,
    mutate: getSubSchema,
    reset: resetSubSchemaData,
    isIdle: isGetSubSchemaIdle,
  } = useGetSubSchema();

  useEffect(() => {
    if (!schemaState.selected || _.isEmpty(schemaState.selected)) {
      resetSubSchemaData();
      getAllSchemas({ projectId });
    } else {
      const selectedSchema = _.last(schemaState?.selected);

      if (
        !_.isEmpty(selectedSchema?.attributes) ||
        !_.isEmpty(selectedSchema?.refs)
      ) {
        let clonedAttributes = [];
        if (!_.isEmpty(selectedSchema?.attributes)) {
          clonedAttributes = _.cloneDeep(selectedSchema?.attributes);
        }

        let clonedRefs = [];
        if (!_.isEmpty(selectedSchema?.refs)) {
          clonedRefs = _.cloneDeep(selectedSchema?.refs);
        }

        setSchemaData([...clonedAttributes, ...clonedRefs]);
      } else {
        if (!isLoadingSubSchema) {
          getSubSchema({
            projectId,
            name: selectedSchema?.name,
            type: selectedSchema?.type,
            ref: selectedSchema?.ref,
          });
        }
      }
    }
  }, [schemaState.selected]);

  useEffect(() => {
    if (subSchemaData) {
      setSchemaData(subSchemaData?.nSchemaArray);
      return;
    }
    setSchemaData(allSchemaData?.nSchemaArray);
  }, [allSchemaData, subSchemaData]);

  const getFullMatchItems = () => {
    return _.filter(schemaData, (schema) => isFullMatch(schema));
  };

  const getPartialMatchItems = () => {
    return _.filter(schemaData, (schema) => isPartialMatch(schema));
  };

  const getNoMatchItems = () => {
    return _.filter(schemaData, (schema) => isNoMatch(schema));
  };

  const onItemClick = (ref) => {
    if (isSchema(ref) || isArray(ref)) {
      const updatedSchemaState = _.cloneDeep(schemaState);

      if (
        !updatedSchemaState?.selected ||
        _.isEmpty(updatedSchemaState?.selected)
      ) {
        updatedSchemaState.selected = [];
      }

      updatedSchemaState?.selected?.push(ref);

      setSchemaState(updatedSchemaState);
    }
  };

  if (isLoading || isLoadingSubSchema) {
    return (
      <LoaderWithMessage
        message='Loading schemas'
        className='h-full'
        contained
      />
    );
  }

  return (
    <div className='mx-4 py-4'>
      <div className='flex flex-row gap-x-5 justify-center'>
        <div className='flex-1 h-fit bg-neutral-gray7 rounded-md p-2'>
          <FullMatch items={getFullMatchItems()} onItemClick={onItemClick} />
        </div>

        <div className='flex-1 h-fit bg-neutral-gray7 rounded-md p-2 '>
          <PartialMatch
            items={getPartialMatchItems()}
            onItemClick={onItemClick}
          />
        </div>

        <div className='flex-1 h-fit  bg-neutral-gray7 rounded-md p-2'>
          <NoMatch items={getNoMatchItems()} onItemClick={onItemClick} />
        </div>
      </div>
    </div>
  );
};

export default Schema;
