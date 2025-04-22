import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    proposals: async (_: any, { filter, sort }: { filter?: any; sort?: any }) =>
      await prisma.proposal.findMany({
        where: {
          deletedAt: null,
          ...(filter?.name && { name: { contains: filter.name } }),
          ...(filter?.stepId && { steps: { some: { id: filter.stepId } } }),
        },
        include: {
          days: true,
          steps: {
            include: {
              days: true,
            },
          },
        },
        orderBy: sort
          ? {
              [sort.field]: sort.order === 'DESC' ? 'desc' : 'asc',
            }
          : undefined,
      }),
    proposal: async (_: any, { id }: { id: number }) =>
      await prisma.proposal.findUnique({
        where: { id, deletedAt: null },
        include: {
          days: true,
          steps: {
            include: {
              days: true,
            },
          },
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
        include: {
          days: true,
          steps: {
            include: {
              days: true,
            },
          },
        },
      }),
    updateProposal: async (_: any, { id, data }: { id: number; data: any }) =>
      prisma.proposal.update({
        where: { id },
        data: {
          name: data.name,
          steps: {
            upsert: data.steps.map(({ id, order, name }: any) => ({
              where: { id },
              update: { order, name },
              create: { order, name },
            })),
          },
          days: {
            upsert: data.days.map(({ id, order, name, stepId }: any) => ({
              where: { id },
              update: { order, name, stepId },
              create: { order, name, stepId },
            })),
          },
        },
        include: {
          days: true,
          steps: {
            include: {
              days: true,
            },
          },
        },
      }),
    deleteProposal: async (_: any, { id }: { id: number }) =>
      prisma.proposal.update({
        where: { id },
        data: { deletedAt: new Date() },
        include: {
          days: true,
          steps: {
            include: {
              days: true,
            },
          },
        },
      }),
  },
};
