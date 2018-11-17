import Knex from 'knex';
import { Model, transaction } from 'objection';

import knexfile from '../../knexfile';
import generateUserModel from './User';
import generatePostModel from './Post';
import generateCommentModel from './Comment';

const env = process.env.NODE_ENV || 'development';
const config = knexfile[env];

const knex = Knex(config);
Model.knex(knex);

export default user => {
  const models = {
    User: generateUserModel(user),
    Post: generatePostModel(user),
    Comment: generateCommentModel(user),
  };

  Object.values(models).forEach(model => {
    if (typeof model.setRelationMappings === 'function')
      model.setRelationMappings(models);
  });

  return {
    ...models,
    transaction,
  };
};
