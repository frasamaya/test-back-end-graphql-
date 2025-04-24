import { createTestServer } from "../test-utils";
import mockPrisma from "../../__mocks__/prisma";

const GET_STEP = `
  query GetStep($id: Int!) {
    step(id: $id) {
      id
      name
      order
    }
  }
`;

interface GetStepResponse {
  step: {
    id: number;
    name: string;
    order: number;
  } | null;
}

describe("Query: step", () => {
  it("should return a single step by ID", async () => {
    // Mock Prisma response
    mockPrisma.step.findUnique.mockResolvedValueOnce({
      id: 1,
      name: "Step 1",
      order: 1,
    });

    const server = createTestServer();

    const response = await server.executeOperation<GetStepResponse>({
      query: GET_STEP,
      variables: { id: 1 },
    });

    if (response.body?.kind === "single") {
      expect(response.body.singleResult.errors).toBeUndefined();
    }
  });

  it("should return null if the step does not exist", async () => {
    // Mock Prisma response
    mockPrisma.step.findUnique.mockResolvedValueOnce(null);

    const server = createTestServer();

    const response = await server.executeOperation<GetStepResponse>({
      query: GET_STEP,
      variables: { id: 999 },
    });

    if (response.body?.kind === "single") {
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.step).toBeNull();
    }
  });
});
