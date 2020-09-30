import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Title from './Title';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
];

export default function VisualizeAPIView() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Visualiza API</Title>
    </React.Fragment>
  );
}
