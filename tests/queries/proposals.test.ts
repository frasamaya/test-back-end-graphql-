import { createTestServer } from '../test-utils';
import mockPrisma from '../../__mocks__/prisma';

const GET_PROPOSALS = `
  query GetProposals($pageSize: Int, $cursor: Int) {
    proposals(pageSize: $pageSize, cursor: $cursor) {
      nodes {
        id
        name
        createdAt
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface GetProposalsResponse {
  proposals: {
    nodes: {
      id: number;
      name: string;
      createdAt: string;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

describe('Query: proposals', () => {
  it('should return a list of proposals with pagination info', async () => {
    // Mock Prisma response
    mockPrisma.proposal.findMany.mockResolvedValueOnce([
      { id: 1, name: 'Proposal 1', createdAt: '2025-04-22T12:00:00Z' },
      { id: 2, name: 'Proposal 2', createdAt: '2025-04-21T12:00:00Z' },
    ]);

    const server = createTestServer();

    const response = await server.executeOperation<GetProposalsResponse>({
      query: GET_PROPOSALS,
      variables: { pageSize: 10, cursor: null },
    });

    if (response.body?.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.proposals).toBeDefined();
      //expect(response.body.singleResult.data?.proposals?.nodes).toHaveLength(2);
      expect(response.body.singleResult.data?.proposals.pageInfo.hasNextPage).toBe(false);
    }
  });
});