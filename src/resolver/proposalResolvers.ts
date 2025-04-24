import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const proposalResolvers = {
  Query: {
    proposals: async (
      _: unknown,
      {
        pageSize = 10,
        cursor,
        filter,
        sort,
      }: { pageSize?: number; cursor?: string; filter?: any; sort?: any },
    ) => {
      const take = pageSize + 1; // Fetch one extra to check for next page
      const proposals = await prisma.proposal.findMany({
        where: {
          deletedAt: null,
          ...(filter?.name && { name: { contains: filter.name } }),
          ...(filter?.stepId && { steps: { some: { id: filter.stepId } } }),
        },
        include: {
          days: {
            orderBy: {
              order: "asc",
            },
          },
          steps: {
            include: {
              days: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: sort
          ? {
              [sort.field]: sort.order === "DESC" ? "desc" : "asc",
            }
          : { id: "asc" },
        take,
        ...(cursor && { skip: 1, cursor: { id: parseInt(cursor, 10) } }),
      });

      const hasNextPage = proposals.length > pageSize;
      if (hasNextPage) proposals.pop(); // Remove the extra record

      return {
        nodes: proposals,
        pageInfo: {
          hasNextPage,
          endCursor:
            proposals.length > 0 ? proposals[proposals.length - 1].id : null,
        },
      };
    },
    proposal: async (_: unknown, { id }: { id: number }) =>
      await prisma.proposal.findUnique({
        where: { id, deletedAt: null },
        include: {
          days: {
            orderBy: {
              order: "asc",
            },
          },
          steps: {
            include: {
              days: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      }),
  },
  Mutation: {
    createProposal: async (_: unknown, { data }: { data: any }) =>
      prisma.proposal.create({
        data: {
          name: data.name,
          ...(data.steps && {
            steps: {
              create: data.steps.map(({ order, name }: any) => ({
                order,
                name,
              })),
            },
          }),
          ...(data.days && {
            days: {
              create: data.days.map(({ order, name, stepId }: any) => ({
                order,
                name,
                stepId,
              })),
            },
          }),
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
    updateProposal: async (
      _: unknown,
      { id, data }: { id: number; data: any },
    ) =>
      prisma.proposal.update({
        where: { id },
        data: {
          name: data.name,
          ...(data.steps && {
            steps: {
              upsert: data.steps.map(({ id, order, name }: any) => ({
                where: { id },
                update: { order, name },
                create: { order, name },
              })),
            },
          }),
          ...(data.days && {
            days: {
              upsert: data.days.map(({ id, order, name, stepId }: any) => ({
                where: { id },
                update: { order, name, stepId },
                create: { order, name, stepId },
              })),
            },
          }),
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
    deleteProposal: async (_: unknown, { id }: { id: number }) =>
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
