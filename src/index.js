import 'core-js';

import server from './server';

const port = process.env.PORT || '4000';

server.listen({ port }).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at ${url}`);
});
