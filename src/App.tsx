import * as React from "react";
import AddTodo from "./AddTodoForm";
import Todos from "./Todos";
import Amplify from "aws-amplify";
import aws_config from "./aws-exports";
require("bootstrap/dist/css/bootstrap.min.css");
Amplify.configure(aws_config);
class App extends React.Component {
  render() {
    return (
      <div className="col-lg-6 col-lg-offset-3">
        <h1>Todos</h1>
        <AddTodo />
        <Todos />
      </div>
    );
  }
}

export default App;
