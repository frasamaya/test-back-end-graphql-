// filepath: __mocks__/prisma.ts
const mockPrisma = {
  proposal: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  step: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  day: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

export const PrismaClient = jest.fn(() => mockPrisma);
export default mockPrisma;
