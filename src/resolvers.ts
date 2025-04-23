import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    proposals: async (_: any, { pageSize = 10, cursor, filter, sort }: { pageSize?: number, cursor?: string, filter?: any; sort?: any }) => {
      const take = pageSize + 1; // Fetch one extra to check for next page
      const proposals = await prisma.proposal.findMany({
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
          : { id: 'asc' },
        take,
        ...(cursor && { skip: 1, cursor: { id: parseInt(cursor, 10) } })
      });

      const hasNextPage = proposals.length > pageSize;
      if (hasNextPage) proposals.pop(); // Remove the extra record

      return {
        nodes: proposals,
        pageInfo: {
          hasNextPage,
          endCursor: proposals.length > 0 ? proposals[proposals.length - 1].id.toString() : null,
        },
      };
    },
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
    steps: async (_: any, { pageSize = 10, cursor, filter, sort }: {  pageSize?: number, cursor?: string, filter?: any; sort?: any }) => {
      const take = pageSize + 1; // Fetch one extra to check for next page
      const steps = await prisma.step.findMany({
        where: {
          ...(filter?.name && { name: { contains: filter.name } }),
          ...(filter?.proposalId && { proposalId: filter.proposalId }),
        },
        include: {
          days: true,
          proposal: {
            include: {
              days: true,
              steps: {
                include: {
                  days: true,
                },
              },
            },
          }
        },
        orderBy: sort
          ? {
              [sort.field]: sort.order === 'DESC' ? 'desc' : 'asc',
            }
          : { id: 'asc' },
        take,
        ...(cursor && { skip: 1, cursor: { id: parseInt(cursor, 10) } })
      });

      const hasNextPage = steps.length > pageSize;
      if (hasNextPage) steps.pop(); // Remove the extra record

      return {
        nodes: steps,
        pageInfo: {
          hasNextPage,
          endCursor: steps.length > 0 ? steps[steps.length - 1].id.toString() : null,
        },
      };
    },
    step: async (_: any, { id }: { id: number }) =>
      await prisma.step.findUnique({
        where: { id },
        include: {
          days: true,
          proposal: {
            include: {
              days: true,
              steps: {
                include: {
                  days: true,
                },
              },
            },
          }
        },
      }),
    days: async (_: any, { pageSize = 10, cursor, filter, sort }: {  pageSize?: number, cursor?: string, filter?: any; sort?: any }) => {
      const take = pageSize + 1; // Fetch one extra to check for next page
      const days = await prisma.day.findMany({
        where: {
          ...(filter?.name && { name: { contains: filter.name } }),
          ...(filter?.stepId && { stepId: filter.stepId }),
        },
        include:{
          step: true,
          proposal: true
        },
        orderBy: sort
          ? {
              [sort.field]: sort.order === 'DESC' ? 'desc' : 'asc',
            }
          : { id: 'asc' },
        take,
        ...(cursor && { skip: 1, cursor: { id: parseInt(cursor, 10) } })
      });

      const hasNextPage = days.length > pageSize;
      if (hasNextPage) days.pop(); // Remove the extra record

      return {
        nodes: days,
        pageInfo: {
          hasNextPage,
          endCursor: days.length > 0 ? days[days.length - 1].id.toString() : null,
        },
      };
    },
    day: async (_: any, { id }: { id: number }) =>
      await prisma.day.findUnique({
        where: { id },
        include:{
          step: true,
          proposal: true
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
    createStep: async (_: any, { data }: { data: any }) =>
      prisma.step.create({
        data: {
          name: data.name,
          order: data.order,
          proposalId: data.proposalId,
          days: {
          create: data.days.map(({ order, name }: any) => ({ order, name })),
          },
        },
        include: {
          days: true,
        },
      }),
    updateStep: async (_: any, { id, data }: { id: number; data: any }) =>
      prisma.step.update({
        where: { id },
        data: {
          name: data.name,
          order: data.order,
          days: {
          upsert: data.days.map(({ id, order, name }: any) => ({
            where: { id },
            update: { order, name },
            create: { order, name },
          })),
          },
        },
        include: {
          days: true,
        },
      }),
    deleteStep: async (_: any, { id }: { id: number }) =>
      prisma.step.delete({
        where: { id },
        include: {
          days: true,
        },
      }),
    createDay: async (_: any, { data }: { data: any }) =>
      prisma.day.create({
        data: {
          name: data.name,
          order: data.order,
          proposal: { connect: { id: data.proposalId } },
          step: { connect: { id: data.stepId } },
        },
        include:{
          step: true,
          proposal: true
        }
      }),
    updateDay: async (_: any, { id, data }: { id: number; data: any }) =>
      prisma.day.update({
        where: { id },
        data: {
          name: data.name,
          order: data.order,
          stepId: data.stepId,
        },
        include:{
          step: true,
          proposal: true
        }
      }),
    deleteDay: async (_: any, { id }: { id: number }) =>
      prisma.day.delete({
        where: { id },
      }),
  },
};
