import React, { useState } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { Dialog, makeStyles } from '@material-ui/core/index';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DashboardSharpIcon from '@material-ui/icons/DashboardSharp';
import { List, ListItem } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useRecoilState } from 'recoil';

import Logo from '../static/images/logo/svg.svg';
import Colors from '../shared/colors';
import routes from '../shared/routes';
import AppIcon from '../shared/components/AppIcon';
import AddProject from '../AddProject';
import projectAtom, { defaultState } from '../AddProject/projectAtom';

const useStyles = makeStyles({
  selectedItem: {
    background: Colors.brand.primarySubtle,
    borderLeft: `5px solid ${Colors.brand.primary}`,
    borderLeftWidth: '5px',
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px',
  },
  root: {
    '&$selected': {
      backgroundColor: Colors.brand.primarySubtle,
      '&:hover': {
        backgroundColor: 'none',
      },
    },
  },
  selected: {},
});

const Dashboard = ({ selectedIndex, children }) => {
  const styles = useStyles();
  const history = useHistory();
  const [dialog, setDialog] = useState({
    show: false,
    data: null,
  });
  const [projectState, setProjectState] = useRecoilState(projectAtom);

  const handleOptionsClick = () => {};

  const handleSideMenuItemClick = (index) => {
    if (index !== selectedIndex) {
      if (index === 0) {
        // Show add new project dialog
        showAddProjectDialog();
      } else if (index === 1) {
        history.push(routes.projects);
      }
    }
  };

  const showAddProjectDialog = () => {
    setDialog({
      show: true,
    });
  };

  const handleCloseDialog = () => {
    setProjectState(defaultState);

    setDialog({
      show: false,
      data: null,
    });
  };

  return (
    <div className='flex flex-col'>
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby='dashboard-dialog'
        open={dialog?.show ?? false}
        fullWidth
        PaperProps={{
          style: { borderRadius: 8 },
        }}
      >
        <AddProject onClose={handleCloseDialog} />
      </Dialog>

      <header
        className='fixed w-full top-0 bg-brand-primary flex flex-row p-4 items-center'
        style={{ height: '56px' }}
      >
        {/* EZAPI logo */}
        <div className='w-full'>
          <img
            src={Logo}
            alt='ezapi logo'
            className='bg-white'
            style={{ height: '28px', width: '28px' }}
          />
        </div>

        {/* Initials logo */}
        <div
          className='bg-white'
          style={{
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.5rem',
            padding: '0.5rem',
          }}
        >
          <p className='text-overline1 text-brand-primary'>AS</p>
        </div>

        {/* Name */}
        <p className='text-overline2 text-white mr-0'>Aravind</p>

        {/* Options */}
        <AppIcon
          aria-label='profile options'
          style={{ color: 'white' }}
          onClick={handleOptionsClick}
        >
          <ExpandMoreIcon />
        </AppIcon>
      </header>

      <section className='h-full flex flex-row' style={{ marginTop: '56px' }}>
        <div className='h-full w-52 fixed left-0 border-r-2 border-gray-100'>
          <List>
            <ListItem
              button
              selected={selectedIndex === 0}
              onClick={() => {
                handleSideMenuItemClick(0);
              }}
              style={{
                padding: '1rem',
                background:
                  selectedIndex === 0 ? Colors.brand.primarySubtle : 'white',
              }}
              className={selectedIndex === 0 ? styles.selectedItem : null}
              disableFocusRipple
              disableTouchRipple
            >
              <ListItemIcon
                style={{
                  minWidth: '0',
                  marginRight: '1rem',
                }}
              >
                <AddIcon
                  className={`${classNames({
                    'text-brand-primary': selectedIndex === 0,
                    'text-neutral-gray2': selectedIndex !== 0,
                  })}`}
                  style={selectedIndex === 0 ? {} : { color: 'grey' }}
                />
              </ListItemIcon>
              <p
                className={`text-overline2 ${classNames({
                  'text-brand-primary': selectedIndex === 0,
                  'text-neutral-gray2': selectedIndex !== 0,
                })}`}
              >
                Create New API
              </p>
            </ListItem>

            <ListItem
              button
              selected={selectedIndex === 1}
              onClick={() => {
                handleSideMenuItemClick(1);
              }}
              style={{
                padding: '1rem',
              }}
              className={selectedIndex === 1 ? styles.selectedItem : null}
              classes={{ root: styles.root, selected: styles.selected }}
              disableFocusRipple
              disableTouchRipple
            >
              <ListItemIcon style={{ minWidth: '0', marginRight: '1rem' }}>
                <DashboardSharpIcon
                  className={`${classNames({
                    'text-brand-primary': selectedIndex === 1,
                    'text-neutral-gray2': selectedIndex !== 1,
                  })}`}
                />
              </ListItemIcon>
              <p
                className={`text-overline2 ${classNames({
                  'text-brand-primary': selectedIndex === 1,
                  'text-neutral-gray2': selectedIndex !== 1,
                })}`}
              >
                Dashboard
              </p>
            </ListItem>
          </List>
        </div>
        <div className='ml-52 w-full' style={{ height: `calc(100vh - 56px)` }}>
          {children}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
