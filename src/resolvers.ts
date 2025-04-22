import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    proposals: () => prisma.proposal.findMany({
      include: { days: true, steps: true },
    }),
    proposal: (_: any, args: { id: number }) => prisma.proposal.findUnique({
      where: { id: args.id },
      include: { days: true, steps: true },
    })
  },
  Mutation: {
    createProposal: async (_: any, { data }: any) => {
      return await prisma.proposal.create({
        data: {
          name: data.name,
          steps: {
            create: data.steps,
          },
          days: {
            create: data.days,
          },
        },
        include: { days: true, steps: true },
      });
    },
    deleteProposal: async (_: any, { id }: any) => {
      return await prisma.proposal.delete({
        where: { id },
        include: { days: true, steps: true },
      });
    },
  },
};
