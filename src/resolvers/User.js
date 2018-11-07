import withPaginatedQuery from '../utils/withPaginatedQuery';
import getUserId from '../utils/getUserId';

export default {
  email: (parent, args, ctx, info) => {
    const { request } = ctx;
    const userId = getUserId(request, false);

    if (userId === parent.id) return parent.email;
    return null;
  },

  posts: withPaginatedQuery('Post')((parent, args, ctx, info) => {
    const { request, db, query } = ctx;
    const { Op } = db.Sequelize;
    const userId = getUserId(request, false);

    if (userId === parent.id) return parent.getPosts(query);

    query.where[Op.and].push({ published: true });

    return parent.getPosts(query);
  }),

  comments: (parent, args, ctx, info) => {
    return parent.getComments();
  },
};
