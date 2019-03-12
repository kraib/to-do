import * as React from "react";
import { FormEvent } from "react";
import { API, graphqlOperation } from "aws-amplify";
import uuid from "uuid/v1";
import * as mutations from "./graphql/mutations";

interface State {
  value: string;
}

export default class AddTodoForm extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { value: "" };
  }
  _updateValue = (value: string) => {
    this.setState({ value });
  };

  _handleSubmit = (e: FormEvent<any>) => {
    e.preventDefault();
    if (!this.state.value.trim()) {
      return;
    }
    const toDoItem = {
      id: uuid(),
      name: this.state.value,
      done: false
    };
    API.graphql(graphqlOperation(mutations.createTodo, { input: toDoItem }));
    this.setState({ value: "" });
  };

  render() {
    const { value } = this.state;
    const { _updateValue, _handleSubmit } = this;
    return (
      <form onSubmit={_handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={e => _updateValue(e.target.value)}
        />
        <button type="submit">Add todo !</button>
      </form>
    );
  }
}
