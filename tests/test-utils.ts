import { ApolloServer } from '@apollo/server';
import { resolvers } from '../src/resolvers';
import { typeDefs } from '../src/schema';

export const createTestServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
};