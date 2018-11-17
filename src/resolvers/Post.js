export default {
  author(parent, args, ctx, info) {
    return parent.getAuthor();
  },

  comments(parent, args, ctx, info) {
    return parent.getComments(args);
  },
};
