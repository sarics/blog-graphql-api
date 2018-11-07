export default {
  author: (parent, args, ctx, info) => {
    return parent.getAuthor();
  },

  post: (parent, args, ctx, info) => {
    return parent.getPost();
  },
};
