import { Model } from 'objection';
import { wrapError, UniqueViolationError } from 'objection-db-errors';
import { AuthenticationError } from 'apollo-server';
import cuid from 'cuid';

import BaseQueryBuilder from './BaseQueryBuilder';

class BaseModel extends Model {
  static QueryBuilder = BaseQueryBuilder;

  static query(...args) {
    return super.query.apply(this, args).onError(err => {
      const dbErr = wrapError(err);

      if (dbErr instanceof UniqueViolationError) {
        const data = dbErr.columns.reduce(
          (errData, col) => ({
            ...errData,
            [col]: [
              {
                message: 'should be unique',
                keyword: 'unique',
                params: null,
              },
            ],
          }),
          {},
        );

        throw BaseModel.createValidationError({
          type: 'ModelValidation',
          data,
        });
      }

      throw dbErr;
    });
  }

  static createAuthenticationError() {
    return new AuthenticationError('UNAUTHENTICATED');
  }

  $beforeInsert() {
    this.id = cuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.id = undefined;
    this.updatedAt = new Date().toISOString();
  }
}

export default BaseModel;
