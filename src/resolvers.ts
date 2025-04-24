import { PrismaClient, Prisma } from "@prisma/client";
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
      }: {
        pageSize?: number;
        cursor?: string;
        filter?: Prisma.ProposalWhereInput;
        sort?: {
          field: keyof Prisma.ProposalOrderByWithRelationInput;
          order: "ASC" | "DESC";
        };
      },
    ) => {
      const take = pageSize + 1; // Fetch one extra to check for next page
      const proposals = await prisma.proposal.findMany({
        where: {
          deletedAt: null,
          ...filter,
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
            proposals.length > 0
              ? proposals[proposals.length - 1].id.toString()
              : null,
        },
      };
    },
    proposal: async (_: unknown, { id }: { id: number }) =>
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
    steps: async (
      _: unknown,
      {
        pageSize = 10,
        cursor,
        filter,
        sort,
      }: {
        pageSize?: number;
        cursor?: string;
        filter?: Prisma.StepWhereInput;
        sort?: {
          field: keyof Prisma.StepOrderByWithRelationInput;
          order: "ASC" | "DESC";
        };
      },
    ) => {
      const take = pageSize + 1; // Fetch one extra to check for next page
      const steps = await prisma.step.findMany({
        where: filter,
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
          endCursor:
            steps.length > 0 ? steps[steps.length - 1].id.toString() : null,
        },
      };
    },
    step: async (_: unknown, { id }: { id: number }) =>
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
      }: {
        pageSize?: number;
        cursor?: string;
        filter?: Prisma.DayWhereInput;
        sort?: {
          field: keyof Prisma.DayOrderByWithRelationInput;
          order: "ASC" | "DESC";
        };
      },
    ) => {
      const take = pageSize + 1; // Fetch one extra to check for next page
      const days = await prisma.day.findMany({
        where: filter,
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
          endCursor:
            days.length > 0 ? days[days.length - 1].id.toString() : null,
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
    createProposal: async (
      _: unknown,
      { data }: { data: Prisma.ProposalCreateInput },
    ) =>
      prisma.proposal.create({
        data,
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
      { id, data }: { id: number; data: Prisma.ProposalUpdateInput },
    ) =>
      prisma.proposal.update({
        where: { id },
        data,
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
    createStep: async (
      _: unknown,
      { data }: { data: Prisma.StepCreateInput },
    ) =>
      prisma.step.create({
        data,
        include: {
          days: true,
        },
      }),
    updateStep: async (
      _: unknown,
      { id, data }: { id: number; data: Prisma.StepUpdateInput },
    ) =>
      prisma.step.update({
        where: { id },
        data,
        include: {
          days: true,
        },
      }),
    deleteStep: async (_: unknown, { id }: { id: number }) =>
      prisma.step.delete({
        where: { id },
        include: {
          days: true,
        },
      }),
    createDay: async (_: unknown, { data }: { data: Prisma.DayCreateInput }) =>
      prisma.day.create({
        data,
        include: {
          step: true,
          proposal: true,
        },
      }),
    updateDay: async (
      _: unknown,
      { id, data }: { id: number; data: Prisma.DayUpdateInput },
    ) =>
      prisma.day.update({
        where: { id },
        data,
        include: {
          step: true,
          proposal: true,
        },
      }),
    deleteDay: async (_: unknown, { id }: { id: number }) =>
      prisma.day.delete({
        where: { id },
      }),
  },
};
