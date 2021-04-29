import React from 'react';

import Dashboard from '../Dashboard';

const Content = () => {
  return <div>Projects</div>;
};

const Projects = () => {
  return (
    <Dashboard selectedIndex={1}>
      <Content />
    </Dashboard>
  );
};

export default Projects;
