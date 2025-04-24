import { proposalResolvers } from "./proposalResolvers";
import { stepResolvers } from "./stepResolvers";
import { dayResolvers } from "./dayResolvers";

export const resolvers = {
  Query: {
    ...proposalResolvers.Query,
    ...stepResolvers.Query,
    ...dayResolvers.Query,
  },
  Mutation: {
    ...proposalResolvers.Mutation,
    ...stepResolvers.Mutation,
    ...dayResolvers.Mutation,
  },
};
