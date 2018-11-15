import getUserId from '../utils/getUserId';

export default {
  email(parent, args, ctx, info) {
    const { request } = ctx;
    const userId = getUserId(request, false);

    if (userId === parent.id) return parent.email;
    return null;
  },

  // posts: withPaginatedQuery('Post')((parent, args, ctx, info) => {
  //   const { request, db, query } = ctx;
  //   const { Op } = db.Sequelize;
  //   const userId = getUserId(request, false);

  //   if (userId === parent.id) return parent.getPosts(query);

  //   query.where[Op.and].push({ published: true });

  //   return parent.getPosts(query);
  // }),
  posts(parent, args, ctx, info) {
    // const { request, db } = ctx;
    // const userId = getUserId(request, false);

    return parent.$relatedQuery('posts').paginated(args);
  },

  comments(parent, args, ctx, info) {
    return parent.$relatedQuery('comments').paginated(args);
  },
};
