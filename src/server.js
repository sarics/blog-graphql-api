import { ApolloServer } from 'apollo-server';
import { importSchema } from 'graphql-import';

import resolvers from './resolvers';
import generateModels from './models';
import getUser from './utils/getUser';

const env = process.env.NODE_ENV || 'development';

export default new ApolloServer({
  typeDefs: importSchema('./src/schema.graphql'),
  resolvers,
  context({ req }) {
    const user = getUser(req);

    return {
      user,
      db: generateModels(user),
    };
  },
  tracing: env === 'development',
});
