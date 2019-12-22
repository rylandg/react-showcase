import React from 'react';

// Because we've imported this at the top of our file,
// we can utilize/access anything declared in StyledComponent.scss
import './StyledComponent.scss';

// This component utilizes inline styles instead of relying
// on an external stylesheet. There is essentially nothing
// that cannot be done using inline styles. That being said,
// many developers (myself included) feel that it hampers
// code readability.
const InlineStyledComponent: React.FC = () => {
  const gradientStyles = {
    height: '50px',
    width: '500px',
    backgroundImage: 'linear-gradient(blue, green)',
    border: '1px solid black',
    color: 'white',
  };
  return (
    <div style={gradientStyles}>
      Accomplished with inline styles
    </div>
  )
}

// This component utilizes classes defined in the css file above
export const StyledComponent: React.FC = () => {
  return (
    <div className='styled-container'>
      <div className='gradient-rectangle'>
        Accomplished with external css file
      </div>
      <InlineStyledComponent />
    </div>
  );
}
