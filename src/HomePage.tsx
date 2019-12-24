import React from 'react';

import { Link } from 'react-router-dom';

import './styles/HomePage.scss';

export const HomePage: React.FC = () => {
  return (
    <ul>
      <li>
        <Link to='/simple-function-component'>
          Simple function component
        </Link>
      </li>
      <li>
        <Link to='/simple-class-component'>
          Simple class component
        </Link>
      </li>
      <li>
        <Link to='/function-component-with-state'>
          Function component with state
        </Link>
      </li>
      <li>
        <Link to='/class-component-with-state'>
          Class component with state
        </Link>
      </li>
      <li>
        <Link to='/styled-component'>
          Styled component
        </Link>
      </li>
      <li>
        <Link to='/drag-and-drop'>
          Drag and drop example
        </Link>
      </li>
    </ul>
  );
}
