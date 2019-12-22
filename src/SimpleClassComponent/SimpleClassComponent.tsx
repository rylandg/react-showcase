import React, { Component } from 'react';

interface SimpleCCProps {
  color?: string;
}

interface SimpleCCStyle {
  width: string;
  height: string;
  backgroundColor: string;
}

interface SimpleCCState {
  style: SimpleCCStyle;
}

class SimpleCCWithProps extends Component<SimpleCCProps, SimpleCCState> {
  constructor(props: SimpleCCProps) {
    super(props);
    this.state = {
      style: {
        width: '50px',
        height: '50px',
        backgroundColor: props.color || 'red',
      }
    }
  }

  // Note that it's possible to access props here as well. In a
  // class component, you can always access props via `this.props`
  render() {
    return <div style={this.state.style}/>;
  }
}


// Classes take in two (semi-optional) types. One type is for
// the props the class will take in, the other is for the state
// the class might have
export class SimpleClassComponent extends Component<any, any> {
  // this is essentially the "function" part of a function component
  render() {
    return (
      <div>
        <SimpleCCWithProps color='blue' />
      </div>
    );
  }
}
