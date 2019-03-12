import Todo from "./Todo";

export default interface QueryResponse {
  data: { listTodos: { items: Todo[] } };
  loading: boolean;
  error: Array<Error>;
}
