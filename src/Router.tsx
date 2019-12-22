import '@reshuffle/code-transform/macro';
import React from 'react';

import { Route, Switch } from 'react-router-dom';

const HelloWorld = () => {
  return (
    <span>Hello World</span>
  );
}

const Router: React.FC = () => {
  return (
    <Switch>
      <Route component={HelloWorld} />
    </Switch>
  );
}

export default Router;
