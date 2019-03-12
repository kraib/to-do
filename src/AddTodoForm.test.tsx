import React from "react";
import AddTodoForm from "./AddTodoForm";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
jest.mock("aws-amplify");
it("renders without crashing", () => {
  configure({ adapter: new Adapter() });
  const component = mount(<AddTodoForm />);
});
