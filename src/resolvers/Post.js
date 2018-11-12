export default {
  author(parent, args, ctx, info) {
    return parent.$relatedQuery('author');
  },

  comments(parent, args, ctx, info) {
    return parent.$relatedQuery('comments');
  },
};
