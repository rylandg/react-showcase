import React, { useState, MouseEvent } from 'react';

// We don't need to define a property type because
// this function component doesn't need props
export const FunctionComponentWithState: React.FC= () => {
  const [count, setCount] = useState<number>(0);

  const handleButtonPress = (evt: MouseEvent) => {
    // This stops the button from using it's built in
    // behavior (as defined by HTML).
    evt.preventDefault();

    // Use the updater function that we destructured from
    // the `useState` hook above
    setCount(count + 1);
  }

  return (
    <div>
      <button onClick={handleButtonPress}>
        {`This button has been clicked ${count} times`}
      </button>
    </div>
  );
}


