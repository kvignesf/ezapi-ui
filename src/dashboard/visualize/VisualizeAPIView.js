import React, { useRef } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Title from '../Title';
import VisualizeView from './VisualizeView';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
];

//export default function VisualizeAPIView() {
const VisualizeAPIView = (props, ref) => {
  return (
    <div ref={ref}>
      <Title>Visualiza API</Title>
      <VisualizeView />
    </div>
  );
}

export default React.forwardRef(VisualizeAPIView);
