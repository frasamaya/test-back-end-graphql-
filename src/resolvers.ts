import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const resolvers = {
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
    steps: async (
      _: unknown,
      {
        pageSize = 10,
        cursor,
        filter,
        sort,
      }: { pageSize?: number; cursor?: string; filter?: any; sort?: any },
    ) => {
      const take = pageSize + 1; // Fetch one extra to check for next page
      const steps = await prisma.step.findMany({
        where: {
          ...(filter?.name && { name: { contains: filter.name } }),
          ...(filter?.proposalId && { proposalId: filter.proposalId }),
        },
        include: {
          days: {
            orderBy: {
              order: "asc",
            },
          },
          proposal: {
            include: {
              days: true,
              steps: {
                include: {
                  days: {
                    orderBy: {
                      order: "asc",
                    },
                  },
                },
              },
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

      const hasNextPage = steps.length > pageSize;
      if (hasNextPage) steps.pop(); // Remove the extra record

      return {
        nodes: steps,
        pageInfo: {
          hasNextPage,
          endCursor: steps.length > 0 ? steps[steps.length - 1].id : null,
        },
      };
    },
    step: async (_: unknown, { id }: { id: number }) =>
      await prisma.step.findUnique({
        where: { id },
        include: {
          days: {
            orderBy: {
              order: "asc",
            },
          },
          proposal: {
            include: {
              days: {
                orderBy: {
                  order: "asc",
                },
              },
              steps: {
                include: {
                  days: {
                    orderBy: {
                      order: "asc",
                    },
                  },
                },
              },
            },
          },
        },
      }),
    days: async (
      _: unknown,
      {
        pageSize = 10,
        cursor,
        filter,
        sort,
      }: { pageSize?: number; cursor?: string; filter?: any; sort?: any },
    ) => {
      const take = pageSize + 1; // Fetch one extra to check for next page
      const days = await prisma.day.findMany({
        where: {
          ...(filter?.name && { name: { contains: filter.name } }),
          ...(filter?.stepId && { stepId: filter.stepId }),
        },
        include: {
          step: true,
          proposal: true,
        },
        orderBy: sort
          ? {
              [sort.field]: sort.order === "DESC" ? "desc" : "asc",
            }
          : { id: "asc" },
        take,
        ...(cursor && { skip: 1, cursor: { id: parseInt(cursor, 10) } }),
      });

      const hasNextPage = days.length > pageSize;
      if (hasNextPage) days.pop(); // Remove the extra record

      return {
        nodes: days,
        pageInfo: {
          hasNextPage,
          endCursor: days.length > 0 ? days[days.length - 1].id : null,
        },
      };
    },
    day: async (_: unknown, { id }: { id: number }) =>
      await prisma.day.findUnique({
        where: { id },
        include: {
          step: true,
          proposal: true,
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
    createStep: async (_: unknown, { data }: { data: any }) =>
      prisma.step.create({
        data: {
          name: data.name,
          order: data.order,
          proposalId: data.proposalId,
          ...(data.days && {
            days: {
              create: data.days.map(({ order, name }: any) => ({
                order,
                name,
              })),
            },
          }),
        },
        include: {
          days: true,
        },
      }),
    updateStep: async (_: unknown, { id, data }: { id: number; data: any }) =>
      prisma.step.update({
        where: { id },
        data: {
          name: data.name,
          order: data.order,
          ...(data.days && {
            days: {
              upsert: data.days.map(({ id, order, name }: any) => ({
                where: { id },
                update: { order, name },
                create: { order, name },
              })),
            },
          }),
        },
        include: {
          days: true,
        },
      }),
    deleteStep: async (_: unknown, { id }: { id: number }) => {
      const deletedStep = await prisma.step.delete({
        where: { id },
        include: {
          days: true,
        },
      });

      // Reorder remaining steps
      await prisma.step.updateMany({
        where: {
          proposalId: deletedStep.proposalId,
          order: {
            gt: deletedStep.order,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });

      return deletedStep;
    },
    createDay: async (_: unknown, { data }: { data: any }) =>
      prisma.day.create({
        data: {
          name: data.name,
          order: data.order,
          proposal: { connect: { id: data.proposalId } },
          step: { connect: { id: data.stepId } },
        },
        include: {
          step: true,
          proposal: true,
        },
      }),
    updateDay: async (_: unknown, { id, data }: { id: number; data: any }) =>
      prisma.day.update({
        where: { id },
        data: {
          name: data.name,
          order: data.order,
          stepId: data.stepId,
        },
        include: {
          step: true,
          proposal: true,
        },
      }),
    deleteDay: async (_: unknown, { id }: { id: number }) => {
      const deletedDay = await prisma.day.delete({
        where: { id },
        include: {
          step: true,
          proposal: true,
        },
      });

      // Reorder remaining days
      await prisma.day.updateMany({
        where: {
          OR: [
            { stepId: deletedDay.stepId },
            { proposalId: deletedDay.proposalId },
          ],
          order: {
            gt: deletedDay.order,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });

      return deletedDay;
    },
  },
};
