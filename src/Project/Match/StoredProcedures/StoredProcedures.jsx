import React, { useState, useEffect } from "react";
import _ from "lodash";
import TableIcon from "../../../static/images/table-icon.svg";
import AddIcon from "@mui/icons-material/Add";
import { useRecoilState } from "recoil";
import storedProcedureAtom from "../../../shared/atom/storedProcedureAtom";
import LoaderWithMessage from "../../../shared/components/LoaderWithMessage";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { useParams } from "react-router";
import Scrollbar from "react-smooth-scrollbar";
import EmptyParameters from "../../../static/images/empty-parameters.svg";
import { isStoredProcedure, useCanEdit } from "../../../shared/utils";
import { useGetStoredProcedures } from "./storedProceduresQuery";
import AppIcon from "../../../shared/components/AppIcon";
import { useRecoilValue } from "recoil";
import { useDrag } from "react-dnd";
import StoredProcedureSection from "./StoredProcedureSection";
import { operationAtomWithMiddleware } from "../../../shared/utils";

const StoredProcedures = () => {
  const { projectId } = useParams();
  const {
    isLoading: isFetchingStoredProcedures,
    data: storedProceduresData,
    error: getStoredProceduresError,
    mutate: fetchStoredProceduresData,
  } = useGetStoredProcedures();
  const operationState = useRecoilValue(operationAtomWithMiddleware);
  const [storedProcedureState, setStoredProcedureState] =
    useRecoilState(storedProcedureAtom);
  const [isHovering, setHovering] = useState(false);
  const [content, setContent] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(false);
  const [dialog, setDialog] = useState({
    show: false,
    type: null,
    data: null,
  });
  const canEdit = useCanEdit();

  useEffect(() => {
    fetchStoredProceduresData({ projectId });
  }, []);

  useEffect(() => {
    if (storedProcedureState?.selected) {
      const inputData = _.cloneDeep(
        storedProcedureState?.selected?.inputAttributes
      );
      const outputData = _.cloneDeep(
        storedProcedureState?.selected?.outputAttributes
      );

      setContent({
        "name": storedProcedureState?.selected?.storedProcedure,
        "contentType": "input/output",
        "data": [inputData, outputData],
        "type": storedProcedureState?.selected?.type,
      });
    } else if (storedProceduresData && !_.isEmpty(storedProceduresData)) {
      setStoredProcedureState(storedProceduresData);

      const clonedStoredProceduresData = _.cloneDeep(storedProceduresData);

      setContent({
        "name": storedProcedureState?.selected?.storedProcedure,
        "contentType": "storedProcedures",
        "data": clonedStoredProceduresData,
        "type": storedProcedureState?.selected?.type,
      });
    }
  }, [storedProceduresData, storedProcedureState?.selected]);

  if (isFetchingStoredProcedures) {
    return (
      <LoaderWithMessage
        message='Loading Stored Procedures'
        className='h-full'
        contained
      />
    );
  }
  // if (!content || _.isEmpty(content)) {
  //   return (
  //     <div className='h-full flex flex-col justify-center items-center'>
  //       <p className='text-overline2'>No tables available</p>
  //     </div>
  //   );

  return (
    <div className='mx-4 py-4'>
      <div className='flex flex-row gap-x-5 justify-center'>
        {content?.contentType == "storedProcedures" && (
          <div className='flex-1 h-fit bg-neutral-gray7 rounded-md p-2'>
            <StoredProcedureSection
              section={"0"}
              items={content?.data?.data}
              onItemClick={(item) => {
                setStoredProcedureState((storedProcedureState) => {
                  const clonedStoredProcedureState =
                    _.cloneDeep(storedProcedureState);

                  clonedStoredProcedureState.selected = item;

                  return clonedStoredProcedureState;
                });
              }}
            />
          </div>
        )}
        {content?.contentType == "input/output" && (
          <>
            {" "}
            <div className='flex-1 h-fit bg-neutral-gray7 rounded-md p-2'>
              <StoredProcedureSection
                section={"1"}
                items={content}
                onItemClick={(item) => {
                  //do nothing
                }}
              />
            </div>
            <div className='flex-1 h-fit bg-neutral-gray7 rounded-md p-2'>
              <StoredProcedureSection
                section={"2"}
                items={content}
                onItemClick={(item) => {
                  //do nothing
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoredProcedures;
