export default {
  author(parent, args, ctx, info) {
    return parent.$relatedQuery('author');
  },

  post(parent, args, ctx, info) {
    return parent.$relatedQuery('post').paginated(args);
  },
};
