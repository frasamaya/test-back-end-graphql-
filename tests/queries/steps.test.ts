import { createTestServer } from "../test-utils";
import mockPrisma from "../../__mocks__/prisma";

const GET_STEPS = `
  query GetSteps($pageSize: Int, $cursor: Int) {
    steps(pageSize: $pageSize, cursor: $cursor) {
      nodes {
        id
        name
        order
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface GetStepsResponse {
  steps: {
    nodes: {
      id: number;
      name: string;
      order: number;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

describe("Query: steps", () => {
  it("should return a list of steps with pagination info", async () => {
    // Mock Prisma response
    mockPrisma.step.findMany.mockResolvedValueOnce([
      { id: 1, name: "Step 1", order: 1 },
      { id: 2, name: "Step 2", order: 2 },
    ]);

    const server = createTestServer();

    const response = await server.executeOperation<GetStepsResponse>({
      query: GET_STEPS,
      variables: { pageSize: 10, cursor: null },
    });

    if (response.body?.kind === "single") {
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.steps).toBeDefined();
      //expect(response.body.singleResult.data?.steps?.nodes).toHaveLength(2);
      expect(response.body.singleResult.data?.steps.pageInfo.hasNextPage).toBe(
        false,
      );
    }
  });
});
