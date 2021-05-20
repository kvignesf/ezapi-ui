import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Tab, Tabs } from "@material-ui/core";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import AppIcon from "../shared/components/AppIcon";
import { useFetchProjectDetails } from "./projectQueries";
import { OutlineButton, PrimaryButton } from "../shared/components/AppButton";
import InitialsAvatar from "../shared/components/InitialsAvatar";
import { getFirstName, getLastName } from "../shared/storage";
import AddOrEditResource from "./Resources/AddOrEditResource";
import Resources from "./Resources/Resources";
import Match from "./Schema";
import OperationDetails from "./OperationDetails";

const Project = () => {
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
  const [operationIndex, setOperationIndex] = useState(null);
  const [selectedResource, setResource] = useState(null);
  const [selectedPath, setPath] = useState(null);
  const [selectedOperation, setOperation] = useState(null);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <header className='px-2 border-b-2 flex flex-row items-center'>
          <div className='flex flex-row py-2 items-center'>
            <AppIcon
              style={{ marginRight: "1rem" }}
              onClick={(event) => {
                event?.preventDefault();
                event?.stopPropagation();

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
              <Tab label='Design' style={{ outline: "none", border: "none" }} />

              <Tab
                label='Visualise'
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
                selectedIndex={operationIndex}
                onOperationSelect={(index, resource, path, operation) => {
                  if (index !== operationIndex) {
                    setOperationIndex(index);
                    setResource(resource);
                    setPath(path);
                    setOperation(operation);
                  }
                }}
              />
            </section>

            <section className='w-full flex flex-col'>
              <Match className='flex-1' />
              <OperationDetails
                className='flex-1'
                resource={selectedResource}
                path={selectedPath}
                operation={selectedOperation}
              />
            </section>
          </div>
        )}
      </DndProvider>
    </>
  );
};

export default Project;
