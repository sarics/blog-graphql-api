export default {
  email(parent, args, ctx, info) {
    const { user } = ctx;

    if (user && user.id === parent.id) return parent.email;
    return null;
  },

  posts(parent, args, ctx, info) {
    return parent.getPosts(args);
  },

  comments(parent, args, ctx, info) {
    return parent.getComments(args);
  },
};
