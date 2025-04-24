import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const stepResolvers = {
  Query: {
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
          : { order: "asc" },
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
  },
  Mutation: {
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
  },
};
