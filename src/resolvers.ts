import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    proposals: async () =>
      await prisma.proposal.findMany({
        include: {
          days: true,
          steps: {
            include: {
              days: true,
            },
          },
        },
      }),
    proposal: async (_: any, { id }: { id: number }) =>
      await prisma.proposal.findUnique({
        where: { id },
        include: {
          days: true,
          steps: {
            include: {
              days: true,
            },
          }
        },
      }),
  },
  Mutation: {
    createProposal: async (_: any, { data }: { data: any }) =>
      prisma.proposal.create({
        data: {
          name: data.name,
          steps: {
            create: data.steps.map(({ order, name }: any) => ({ order, name })),
          },
          days: {
            create: data.days.map(({ order, name, stepId }: any) => ({
              order,
              name,
              stepId,
            })),
          },
        },
        include: { days: true, steps: true },
      }),
    deleteProposal: async (_: any, { id }: { id: number }) =>
      prisma.proposal.delete({
        where: { id },
        include: { days: true, steps: true },
      }),
  },
};
