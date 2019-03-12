import * as React from "react";
import Todo from "./models/Todo";
import { API, graphqlOperation } from "aws-amplify";
import * as queries from "./graphql/queries";
import * as subscriptions from "./graphql/subscriptions";
import * as mutations from "./graphql/mutations";
import QueryResponse from "./models/QueryResponse";

interface State {
  loading: boolean;
  items: Todo[];
  error?: Array<Error>;
}

export default class TodoList extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loading: true,
      items: []
    };
  }
  onToDo = (
    prevQuery: { listTodos: { items: Todo[] } },
    newData: { onCreateTodo: Todo }
  ) => {
    let createQuery = Object.assign({}, prevQuery);
    createQuery.listTodos.items = prevQuery.listTodos.items.concat([
      newData.onCreateTodo
    ]);
    return createQuery;
  };
  toggleTodo = async (todo: Todo) => {
    await API.graphql(
      graphqlOperation(mutations.updateTodo, {
        input: { ...todo, done: !todo.done }
      })
    );
    // location.reload();
  };
  deleteSubscription: any;
  createSubscription: any;
  updateSubscription: any;
  componentDidMount() {
    this.getItems();
    this.createSubscriptions();
  }
  componentWillUnmount() {
    this.deleteSubscription.unSubscribe();
    this.createSubscription.unSubscribe();
    this.updateSubscription.unSubscribe();
  }
  createSubscriptions() {
    this.createSubscription = API.graphql(
      graphqlOperation(subscriptions.onCreateTodo)
    );
    this.createSubscription.subscribe({
      next: ({
        value: {
          data: { onCreateTodo }
        }
      }: {
        value: { data: { onCreateTodo: Todo } };
      }) => {
        // console.log(value);
        this.setState({ items: this.state.items.concat(onCreateTodo) });
      }
    });

    this.deleteSubscription = API.graphql(
      graphqlOperation(subscriptions.onDeleteTodo)
    );
    this.deleteSubscription.subscribe({
      next: ({
        value: {
          data: { onDeleteTodo }
        }
      }: {
        value: { data: { onDeleteTodo: Todo } };
      }) => {
        // console.log(value);
        this.setState({
          items: this.state.items.filter(item => item.id != onDeleteTodo.id)
        });
      }
    });

    this.updateSubscription = API.graphql(
      graphqlOperation(subscriptions.onUpdateTodo)
    );
    this.updateSubscription.subscribe({
      next: ({
        value: {
          data: { onUpdateTodo }
        }
      }: {
        value: { data: { onUpdateTodo: Todo } };
      }) => {
        // console.log(value);
        this.setState({
          items: this.state.items.map(item => {
            if (item.id === onUpdateTodo.id) {
              return onUpdateTodo;
            }
            return item;
          })
        });
      }
    });
  }
  getItems = async () => {
    const res = (await API.graphql(
      graphqlOperation(queries.listTodos)
    )) as QueryResponse;
    this.setState({
      loading: res.loading,
      items: res.data.listTodos.items,
      error: res.error
    });
  };
  deleteTodo = async (todo: Todo) => {
    await API.graphql(
      graphqlOperation(mutations.deleteTodo, {
        input: { id: todo.id }
      })
    );
    // location.reload();
  };
  render() {
    if (this.state.error) return <h3>Error</h3>;
    if (this.state.loading || !this.state.items) return <h3>Loading...</h3>;
    return (
      <ul>
        {this.state.items.map(todo => (
          <li
            key={todo.id}
            onClick={() => this.toggleTodo(todo)}
            style={{
              textDecoration: `${todo.done ? "line-through" : ""}`,
              cursor: "pointer"
            }}
          >
            {todo.name}{" "}
            <button onClick={() => this.toggleTodo(todo)}>Toggle</button>
            <button onClick={() => this.deleteTodo(todo)}>Delete</button>
          </li>
        ))}
      </ul>
    );
  }
}
