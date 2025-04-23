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
    proposal: Proposal!
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
    proposal: Proposal!
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

  enum ProposalSortableField {
    id
    name
    createdAt
    updatedAt
  }

  enum StepSortableField {
    id
    name
    order
    createdAt
    updatedAt
  }

  enum DaySortableField {
    id
    name
    order
    createdAt
    updatedAt
  }

  input Sort {
    field: String!
    order: SortOrder!
  }

  input ProposalSort {
    field: ProposalSortableField!
    order: SortOrder!
  }

  input StepSort {
    field: StepSortableField!
    order: SortOrder!
  }

  input DaySort {
    field: DaySortableField!
    order: SortOrder!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type ProposalConnection {
    nodes: [Proposal!]!
    pageInfo: PageInfo!
  }

  type StepConnection {
    nodes: [Step!]!
    pageInfo: PageInfo!
  }

  type DayConnection {
    nodes: [Day!]!
    pageInfo: PageInfo!
  }

  type Query {
    proposals(pageSize: Int, cursor: Int, filter: Filter, sort: ProposalSort): ProposalConnection!
    proposal(id: Int!): Proposal
    steps(pageSize: Int, cursor: Int, filter: Filter, sort: StepSort): StepConnection!
    step(id: Int!): Step
    days(pageSize: Int, cursor: Int, filter: Filter, sort: DaySort): DayConnection!
    day(id: Int!): Day
  }

  type Mutation {
    createProposal(data: ProposalInput!): Proposal!
    updateProposal(id: Int!, data: ProposalInput!): Proposal!
    deleteProposal(id: Int!): Proposal!
    createStep(data: StepInput!): Step!
    updateStep(id: Int!, data: StepInput!): Step!
    deleteStep(id: Int!): Step!
    createDay(data: DayInput!): Day!
    updateDay(id: Int!, data: DayInput!): Day!
    deleteDay(id: Int!): Day!
  }
`;