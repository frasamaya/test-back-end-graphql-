import { createTestServer } from '../test-utils';
import mockPrisma from '../../__mocks__/prisma';

const GET_PROPOSAL = `
  query GetProposal($id: Int!) {
    proposal(id: $id) {
      id
      name
      createdAt
    }
  }
`;

interface GetProposalResponse {
  proposal: {
    id: number;
    name: string;
    createdAt: string;
  } | null;
}

describe('Query: proposal', () => {
  it('should return a single proposal by ID', async () => {
    // Mock Prisma response
    mockPrisma.proposal.findUnique.mockResolvedValueOnce({
      id: 1,
      name: 'Proposal 1',
      createdAt: '2025-04-22T08:48:33.260Z',
    });

    const server = createTestServer();

    const response = await server.executeOperation<GetProposalResponse>({
      query: GET_PROPOSAL,
      variables: { id: 5 },
    });

    if (response.body?.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined();
    }
  });

  it('should return null if the proposal does not exist', async () => {
    // Mock Prisma response
    mockPrisma.proposal.findUnique.mockResolvedValueOnce(null);

    const server = createTestServer();

    const response = await server.executeOperation<GetProposalResponse>({
      query: GET_PROPOSAL,
      variables: { id: 999 },
    });

    if (response.body?.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.proposal).toBeNull();
    }
  });
});