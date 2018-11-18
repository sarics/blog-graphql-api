export default {
  me(parent, args, ctx, info) {
    const { db } = ctx;

    return db.User.me();
  },

  async users(parent, args, ctx, info) {
    const { db } = ctx;

    const [users, total] = await Promise.all([
      db.User.getAll(args),
      db.User.countAll(args),
    ]);

    ctx.extensions.total = total;
    return users;
  },
  user(parent, args, ctx, info) {
    const { id } = args;
    const { db } = ctx;

    return db.User.getById(id);
  },

  async posts(parent, args, ctx, info) {
    const { db } = ctx;

    const [posts, total] = await Promise.all([
      db.Post.getAll(args),
      db.Post.countAll(args),
    ]);

    ctx.extensions.total = total;
    return posts;
  },
  post(parent, args, ctx, info) {
    const { id } = args;
    const { db } = ctx;

    return db.Post.getById(id);
  },

  async comments(parent, args, ctx, info) {
    const { db } = ctx;

    const [comments, total] = await Promise.all([
      db.Comment.getAll(args),
      db.Comment.countAll(args),
    ]);

    ctx.extensions.total = total;
    return comments;
  },
  comment(parent, args, ctx, info) {
    const { id } = args;
    const { db } = ctx;

    return db.Comment.getById(id);
  },
};
