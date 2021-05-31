import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Tab, Tabs } from "@material-ui/core";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useResetRecoilState, useRecoilState } from "recoil";

import AppIcon from "../shared/components/AppIcon";
import { useFetchProjectDetails } from "./projectQueries";
import { OutlineButton, PrimaryButton } from "../shared/components/AppButton";
import InitialsAvatar from "../shared/components/InitialsAvatar";
import { getFirstName, getLastName } from "../shared/storage";
import AddOrEditResource from "./Resources/AddOrEditResource";
import Resources from "./Resources/Resources";
import Match from "./Match";
import OperationDetails from "./OperationDetails";
import operationAtom, {
  defaultState as operationAtomDefaultState,
} from "./operationAtom";
import schemaAtom, {
  defaultState as schemaAtomDefaultState,
} from "./Match/Schema/schemaAtom";
import { ClassNames } from "@emotion/react";
import classNames from "classnames";
import _ from "lodash";

const Project = () => {
  const resetOperationState = useResetRecoilState(operationAtom);
  const { id: projectId } = useParams();
  const history = useHistory();
  const firstName = getFirstName();
  const lastName = getLastName();
  const {
    isLoading: isFetchingProjectDetails,
    isSuccess: isProjectDetailsFetched,
    error: projectDetailsError,
    data: projectDetails,
  } = useFetchProjectDetails(projectId);
  const [currentTab, setCurrentTab] = useState(0);
  const [operationState, setOperationState] = useRecoilState(operationAtom);
  const [schemaState, setSchemaState] = useRecoilState(schemaAtom);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <header className='px-2 border-b-2 flex flex-row items-center bg-white'>
          <div className='flex flex-row py-2 items-center'>
            <AppIcon
              style={{ marginRight: "1rem" }}
              onClick={(event) => {
                event?.preventDefault();
                event?.stopPropagation();

                setOperationState(operationAtomDefaultState);
                setSchemaState(schemaAtomDefaultState);

                history.goBack();
              }}
            >
              <ArrowBackIcon />
            </AppIcon>

            <p className='text-overline1'>{projectDetails?.projectName}</p>
          </div>

          <div className='flex justify-center flex-1'>
            <Tabs
              value={currentTab}
              onChange={(_, index) => {}}
              aria-label='add project tabs'
              indicatorColor='primary'
              textColor='primary'
            >
              <Tab
                label={
                  <span className='text-overline2 capitalize'>Design</span>
                }
                style={{ outline: "none", border: "none" }}
              />

              <Tab
                label={
                  <span className='text-overline2 capitalize'>Visualize</span>
                }
                style={{ outline: "none", border: "none" }}
                disabled
              />
            </Tabs>
          </div>

          <div className='flex flex-row py-2'>
            <OutlineButton classes='mr-3'>Invite</OutlineButton>

            <PrimaryButton classes='mr-3'>Publish</PrimaryButton>

            <InitialsAvatar firstName={firstName} lastName={lastName} />
          </div>
        </header>

        {currentTab === 0 && (
          <div
            className='flex flex-row'
            style={{ height: `calc(100vh - 60px)` }}
          >
            <section
              className='w-1/5 border-r-2 h-full'
              style={{ minWidth: "220px", maxWidth: "300px" }}
            >
              <Resources
                className='h-full flex flex-col'
                projectId={projectId}
                selectedIndex={operationState.operationIndex}
                onOperationSelect={(index, resource, path, operation) => {
                  if (index !== operationState.operationIndex) {
                    resetOperationState();

                    const cloned = _.cloneDeep(operationState);
                    cloned.operation = operation;
                    cloned.resource = resource;
                    cloned.path = path;
                    cloned.operationIndex = index;

                    setOperationState(cloned);
                  }
                }}
              />
            </section>

            <section className='w-full flex flex-col'>
              <div
                className={classNames(`overflow-hidden`, {
                  "h-1/2": operationState.operationIndex,
                  "h-full": !operationState.operationIndex,
                })}
              >
                <Match />
              </div>

              {operationState.resource &&
                operationState.path &&
                operationState.operation && (
                  <div
                    className={classNames({
                      "h-1/2": operationState.operationIndex !== null,
                    })}
                  >
                    <OperationDetails />
                  </div>
                )}
            </section>
          </div>
        )}
      </DndProvider>
    </>
  );
};

export default Project;
