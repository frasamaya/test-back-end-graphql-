import { createTestServer } from '../test-utils';
import mockPrisma from '../../__mocks__/prisma';

const GET_DAYS = `
  query GetDays($pageSize: Int, $cursor: Int) {
    days(pageSize: $pageSize, cursor: $cursor) {
      nodes {
        id
        name
        order
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface GetDaysResponse {
  days: {
    nodes: {
      id: number;
      name: string;
      order: number;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

describe('Query: days', () => {
  it('should return a list of days with pagination info', async () => {
    // Mock Prisma response
    mockPrisma.day.findMany.mockResolvedValueOnce([
      { id: 1, name: 'Day 1', order: 1 },
      { id: 2, name: 'Day 2', order: 2 },
    ]);

    const server = createTestServer();

    const response = await server.executeOperation<GetDaysResponse>({
      query: GET_DAYS,
      variables: { pageSize: 10, cursor: null },
    });

    if (response.body?.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.days).toBeDefined();
      //expect(response.body.singleResult.data?.days?.nodes).toHaveLength(2);
      expect(response.body.singleResult.data?.days.pageInfo.hasNextPage).toBe(false);
    }
  });
});