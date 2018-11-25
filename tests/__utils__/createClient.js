import { ApolloServer } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';
import { importSchema } from 'graphql-import';

import resolvers from '../../src/resolvers';
import generateModels from '../../src/models';
import formatResponse from '../../src/utils/formatResponse';

export default (authUser = null) => {
  const user = authUser ? { id: authUser.id } : null;

  const server = new ApolloServer({
    typeDefs: importSchema('./src/schema.graphql'),
    resolvers,
    context() {
      return {
        user,
        db: generateModels(user),
        extensions: {},
      };
    },
    formatResponse,
  });

  return createTestClient(server);
};
