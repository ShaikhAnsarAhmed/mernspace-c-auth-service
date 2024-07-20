import app from "./src/app";
import { calculateDiscout } from "./src/utils";
import request from "supertest";

describe("App", () => {
  it("should calculate the discount", () => {
    const result = calculateDiscout(100, 10);
    expect(result).toBe(10);
  });

  it("should return 200 status", async () => {
    const response = await request(app).get("/").send();
    expect(response.statusCode).toBe(200);
  });
});
