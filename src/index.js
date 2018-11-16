import '@babel/polyfill';

import { ApolloServer } from 'apollo-server';
import { importSchema } from 'graphql-import';

import resolvers from './resolvers';
import db from './models';

const server = new ApolloServer({
  typeDefs: importSchema('./src/schema.graphql'),
  resolvers,
  context({ req }) {
    return {
      request: req,
      db,
    };
  },
});

server.listen({ port: process.env.PORT || '4000' }).then(({ url }) => {
  console.log(`Server ready at ${url} 🚀`);
});
