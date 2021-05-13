import React, { useState } from "react";
import { useParams } from "react-router";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Tab, Tabs } from "@material-ui/core";

import AppIcon from "../shared/components/AppIcon";
import { useFetchProjectDetails } from "./projectQueries";
import { OutlineButton, PrimaryButton } from "../shared/components/AppButton";
import InitialsAvatar from "../shared/components/InitialsAvatar";
import { getFirstName, getLastName } from "../shared/storage";
import AddOrEditResource from "./AddOrEditResource";
import Resources from "./Resources/Resources";

const Project = () => {
  const { id: projectId } = useParams();
  const firstName = getFirstName();
  const lastName = getLastName();
  const {
    isLoading: isFetchingProjectDetails,
    isSuccess: isProjectDetailsFetched,
    error: projectDetailsError,
    data: projectDetails,
  } = useFetchProjectDetails(projectId);
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <>
      <header className='px-2 border-b-2 flex flex-row items-center'>
        <div className='flex flex-row py-2'>
          <AppIcon style={{ marginRight: "1rem" }}>
            <ArrowBackIcon />
          </AppIcon>

          <p>{"projectDetails?.name"}</p>
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
        <div className='flex flex-row' style={{ height: `calc(100vh - 60px)` }}>
          <section
            className='w-1/5 border-r-2'
            style={{ minWidth: "220px", maxWidth: "300px" }}
          >
            <Resources />
          </section>

          <section className='w-full'></section>
        </div>
      )}
    </>
  );
};

export default Project;
