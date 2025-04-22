export const typeDefs = `#graphql
  scalar DateTime

  type Proposal {
    id: Int!
    name: String!
    days: [Day!]!
    steps: [Step!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Day {
    id: Int!
    order: Int!
    name: String!
    step: Step!
    proposalId: Int!
    stepId: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Step {
    id: Int!
    order: Int!
    name: String!
    proposalId: Int!
    days: [Day!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input StepInput {
    order: Int!
    name: String!
  }

  input DayInput {
    order: Int!
    name: String!
    stepId: Int!
  }

  input ProposalInput {
    name: String!
    steps: [StepInput!]!
    days: [DayInput!]!
  }

  input Filter {
    name: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  enum SortOrder {
    ASC
    DESC
  }

  input Sort {
    field: String!
    order: SortOrder!
  }

  type Query {
    proposals(pageSize: Int, cursor: Int, filter: Filter, sort: Sort): [Proposal!]!
    proposal(id: Int!): Proposal
  }

  type Mutation {
    createProposal(data: ProposalInput!): Proposal!
    updateProposal(id: Int!, data: ProposalInput!): Proposal!
    deleteProposal(id: Int!): Proposal!
  }
`;