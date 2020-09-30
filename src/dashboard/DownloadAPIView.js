import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Title from './Title';

function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('00:00', 0),
  createData('24:00', undefined),
];

export default function DownloadAPIView() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Download Ez API / History</Title>
    </React.Fragment>
  );
}
