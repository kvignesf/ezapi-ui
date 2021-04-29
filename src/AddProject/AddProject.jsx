import React, { useState, useRef } from 'react';
import {
  AppBar,
  IconButton,
  Tab,
  Tabs,
  MuiThemeProvider,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { createMuiTheme } from '@material-ui/core/styles';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';

import AppIcon from '../shared/components/AppIcon';
import { PrimaryButton, TextButton } from '../shared/components/AppButton';
import ProjectDetails from './ProjectDetails';
import InviteCollaborators from './InviteCollaborators';
import projectAtom from './projectAtom';
import _ from 'lodash';

const AddProject = ({ onClose }) => {
  const [currentTab, setTab] = useState(0);
  const projectDetails = useRecoilValue(projectAtom);
  const formRef = useRef();

  const handleNext = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();

      if (formRef.current.isValid && !_.isEmpty(projectDetails?.name)) {
        setTab(1);
      }
    }
  };

  const handleDone = () => {
    if (_.isEmpty(projectDetails?.name)) {
      if (formRef.current) {
        formRef.current.handleSubmit();
      }

      setTab(0);
      return;
    }
  };

  return (
    <div className='p-4'>
      <div className='flex flex-row items-center justify-between'>
        <h5>Create New API Project</h5>

        <AppIcon aria-label='close' onClick={onClose}>
          <CloseIcon />
        </AppIcon>
      </div>

      <Tabs
        value={currentTab}
        onChange={(_, index) => {
          setTab(index);
        }}
        aria-label='add project tabs'
        indicatorColor='primary'
        textColor='primary'
      >
        <Tab
          label='1. Create API'
          style={{ outline: 'none', border: 'none' }}
        />
        <Tab
          label='2. Invite Collaborator'
          style={{ outline: 'none', border: 'none' }}
        />
      </Tabs>

      {/* Content */}
      <div className='h-full'>
        {currentTab === 0 ? (
          <div>
            <ProjectDetails formRef={formRef} />
          </div>
        ) : (
          <div>
            <InviteCollaborators />
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className='border-t-2 border-neutral-gray7 flex flex-row items-center justify-end pt-4'>
        {currentTab === 1 ? (
          <TextButton
            onClick={() => {
              handleDone();
            }}
            classes='flex-1 -ml-4 text-brand-secondary'
          >
            Skip for now
          </TextButton>
        ) : null}

        <TextButton
          onClick={() => {
            if (currentTab === 0) {
              onClose();
            } else {
              setTab(0);
            }
          }}
          classes='mr-3'
        >
          {currentTab === 0 ? 'Cancel' : 'Back'}
        </TextButton>

        <PrimaryButton
          onClick={() => {
            if (currentTab === 0) {
              handleNext();
            } else {
              handleDone();
            }
          }}
        >
          {currentTab === 0 ? 'Next' : 'Done'}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default AddProject;
