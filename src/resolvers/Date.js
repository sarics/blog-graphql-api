import { GraphQLScalarType, Kind } from 'graphql';

export default new GraphQLScalarType({
  name: 'Date',
  description:
    'A string representing the given date in the ISO 8601 format according to universal time.',
  serialize(value) {
    return value.toISOString(); // value sent to the client
  },
  parseValue(value) {
    return new Date(value); // value from the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      const intVal = parseInt(ast.value, 10);
      return new Date(intVal).toISOString();
    }
    return null;
  },
});
