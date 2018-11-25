export default (resp, { context }) => ({
  ...resp,
  extensions: {
    ...resp.extensions,
    ...context.extensions,
  },
});
