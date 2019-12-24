import React, { Component, MouseEvent } from 'react';

// We need to define the structure of our state
interface ClassState {
  count: number;
}

// Classes take in two (semi-optional) types. One type is for
// the props the class will take in, the other is for the state
// the class might have. Here we provide only ClassState and
// give an empty object as our props type
//
export class ClassComponentWithState extends Component<{}, ClassState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  /**
   * We declare this method with an arrow operator because
   * it changes what scope the function is bound to. If we
   * didn't delcare it like this, we wouldn't be able to pass
   * it as a callback for an event handler.
   *
   */
  handleButtonPress = (evt: MouseEvent) => {
    // This stops the button from using it's built in
    // behavior (as defined by HTML).
    evt.preventDefault();

    // When you need to update the state based on the
    // current state value, you need to use a function
    // updater.
    this.setState((oldState) => {
      return {
        count: oldState.count + 1,
      }
    });
  }

  /**
   * This is essentially the "function" part of a function component.
   */
  render() {
    const { count } = this.state;
    return (
      <div>
        <button onClick={this.handleButtonPress}>
          {`This button has been clicked ${count} times`}
        </button>
      </div>
    );
  }
}
