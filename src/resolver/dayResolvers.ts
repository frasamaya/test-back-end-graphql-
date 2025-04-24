import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const dayResolvers = {
  Query: {
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
          : { order: "asc" },
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
