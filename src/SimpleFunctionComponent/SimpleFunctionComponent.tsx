import React from 'react';

// our props consists of a single (optional) parameter
interface SimpleFCProps {
  color?: string;
}

// this is a simple function component that takes in a single
// prop that is used to control the color
const SimpleFCWithProps: React.FC<SimpleFCProps> = ({ color }) => {
  const style = {
    width: '50px',
    height: '50px',
    backgroundColor: color || 'red',
  };
  return <div style={style} />
}

// this is both our wrapper and a very simple example
export const SimpleFunctionComponent: React.FC = () => {
  return (
    <div>
      <SimpleFCWithProps color='blue' />
    </div>
  );
}
