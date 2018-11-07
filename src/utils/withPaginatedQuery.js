export default model => fn => async (parent, args, ctx, info) => {
  const { first, skip, after, orderBy = { field: 'id', order: 'ASC' } } = args;
  const { db } = ctx;
  const { Op } = db.Sequelize;
  const query = {
    where: {
      [Op.and]: [],
    },
    order: [],
  };

  if (first) query.limit = first;
  if (skip) query.offset = skip;

  query.order.push([orderBy.field, orderBy.order]);
  if (orderBy.field !== 'id') {
    query.order.push(['id', orderBy.order]);
  }

  if (after) {
    const op = orderBy.order === 'ASC' ? Op.gt : Op.lt;

    if (orderBy.field === 'id') {
      query.where[Op.and].push({
        id: {
          [op]: after,
        },
      });
    } else {
      const afterItem = await db[model].findOne({
        attributes: [orderBy.field],
        where: { id: after },
      });

      query.where[Op.and].push({
        [Op.or]: [
          {
            [orderBy.field]: {
              [op]: afterItem[orderBy.field],
            },
          },
          {
            [orderBy.field]: afterItem[orderBy.field],
            id: {
              [op]: after,
            },
          },
        ],
      });
    }
  }

  return fn(parent, args, { ...ctx, query }, info);
};
