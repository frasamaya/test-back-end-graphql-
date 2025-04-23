import { createTestServer } from '../test-utils';
import mockPrisma from '../../__mocks__/prisma';

const GET_DAY = `
  query GetDay($id: Int!) {
    day(id: $id) {
      id
      name
      order
    }
  }
`;

interface GetDayResponse {
  day: {
    id: number;
    name: string;
    order: number;
  } | null;
}

describe('Query: day', () => {
  it('should return a single day by ID', async () => {
    // Mock Prisma response
    mockPrisma.day.findUnique.mockResolvedValueOnce({
      id: 1,
      name: 'Day 1',
      order: 1,
    });

    const server = createTestServer();

    const response = await server.executeOperation<GetDayResponse>({
      query: GET_DAY,
      variables: { id: 1 },
    });

    if (response.body?.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined();
    }
  });

  it('should return null if the day does not exist', async () => {
    // Mock Prisma response
    mockPrisma.day.findUnique.mockResolvedValueOnce(null);

    const server = createTestServer();

    const response = await server.executeOperation<GetDayResponse>({
      query: GET_DAY,
      variables: { id: 999 },
    });

    if (response.body?.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.day).toBeNull();
    }
  });
});