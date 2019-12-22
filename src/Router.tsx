import '@reshuffle/code-transform/macro';
import React from 'react';

import { Route, Switch } from 'react-router-dom';

import { HomePage } from './HomePage';
import { SimpleFunctionComponent } from './SimpleFunctionComponent/SimpleFunctionComponent';
import { SimpleClassComponent } from './SimpleClassComponent/SimpleClassComponent';
import { StyledComponent } from './StyledComponent/StyledComponent';

const Router: React.FC = () => {
  return (
    <Switch>
      <Route
        component={SimpleFunctionComponent}
        path='/simple-function-component'
      />
      <Route
        component={SimpleClassComponent}
        path='/simple-class-component'
      />
      <Route
        component={StyledComponent}
        path='/styled-component'
      />
      <Route component={HomePage} />
    </Switch>
  );
}

export default Router;
