import '@reshuffle/code-transform/macro';
import React from 'react';

import { Route, Switch } from 'react-router-dom';

import { HomePage } from './HomePage';
import { SimpleFunctionComponent } from './SimpleFunctionComponent/SimpleFunctionComponent';
import { SimpleClassComponent } from './SimpleClassComponent/SimpleClassComponent';
import { StyledComponent } from './StyledComponent/StyledComponent';
import { DragAndDropComponent } from './DragAndDropComponent/DragAndDropComponent';
import { ClassComponentWithState } from './ClassComponentWithState/ClassComponentWithState';
import { FunctionComponentWithState } from './FunctionComponentWithState/FunctionComponentWithState';


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
        component={FunctionComponentWithState}
        path='/function-component-with-state'
      />
      <Route
        component={ClassComponentWithState}
        path='/class-component-with-state'
      />
      <Route
        component={StyledComponent}
        path='/styled-component'
      />
      <Route
        component={DragAndDropComponent}
        path='/drag-and-drop'
      />
      <Route component={HomePage} />
    </Switch>
  );
}

export default Router;
