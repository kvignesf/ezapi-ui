import React from 'react';

const Dashboard = () => {
  return (
    <div className='flex flex-col'>
      <div className='fixed w-full top-0' style={{ height: '56px' }}>
        appbar
      </div>
      <div className='h-full flex flex-row' style={{ marginTop: '56px' }}>
        <div className='h-full w-52 fixed left-0'>left section</div>
        <div className='ml-52 w-full min-h-screen'>Content</div>
      </div>
    </div>
  );
};

export default Dashboard;
