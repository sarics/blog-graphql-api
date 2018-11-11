import '@babel/polyfill';

import { GraphQLServer } from 'graphql-yoga';

import resolvers from './resolvers';
import db from './models';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return {
      request,
      db,
    };
  },
});

server.start({ port: process.env.PORT || '4000' }, ({ port }) => {
  console.log(`server is running on port ${port} 🚀`);
});
