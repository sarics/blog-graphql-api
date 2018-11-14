import { QueryBuilder } from 'objection';

class BaseQueryBuilder extends QueryBuilder {
  paginated({
    first,
    skip,
    after,
    orderBy = { field: 'id', order: 'ASC' },
  } = {}) {
    if (first) this.limit(first);
    if (skip) this.offset(skip);

    if (after) {
      const op = orderBy.order === 'ASC' ? '>' : '<';

      if (orderBy.field === 'id') {
        this.where('id', op, after);
      } else {
        const model = this.modelClass();
        const subquery = model
          .query()
          .select({ afterCol: orderBy.field })
          .findById(after);

        this.with('after', subquery)
          .select(`${model.tableName}.*`, 'after.afterCol')
          .from(model.raw('??, ??', [model.tableName, 'after']))
          .where(qb => {
            qb.where(
              orderBy.field,
              op,
              model.raw('??', 'after.afterCol'),
            ).orWhere(qb2 => {
              qb2
                .where(orderBy.field, model.raw('??', 'after.afterCol'))
                .where('id', op, after);
            });
          });
      }
    }

    this.orderBy(orderBy.field, orderBy.order);
    if (orderBy.field !== 'id') {
      this.orderBy('id', orderBy.order);
    }

    return this;
  }
}

export default BaseQueryBuilder;
