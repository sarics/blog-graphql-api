import { seed as usersSeed } from './users';

export { users } from './users';

export const runSeeds = async knex => {
  await usersSeed(knex);
};
