export const configure = jest.fn();
export const API = {
  graphql: jest.fn((...args) => {
    console.log(args);
    return Promise.resolve();
  })
};
