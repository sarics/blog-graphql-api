import Knex from 'knex';
import { Model, transaction } from 'objection';

import knexfile from '../../knexfile';
import User from './User';
import Post from './Post';
import Comment from './Comment';

const env = process.env.NODE_ENV || 'development';
const config = knexfile[env];

const knex = Knex(config);
Model.knex(knex);

const models = {
  User,
  Post,
  Comment,
};
Object.values(models).forEach(model => {
  if (typeof model.setRelationMappings === 'function')
    model.setRelationMappings(models);
});

export default {
  ...models,
  transaction,
};
