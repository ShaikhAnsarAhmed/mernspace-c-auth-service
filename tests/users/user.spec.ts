import { DataSource } from "typeorm";

import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import createJWKSMock from "mock-jwks";

import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("GET auth/self", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    jwks = createJWKSMock(`http://localhost:5501`);
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwks.start();
    // database truncate
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterEach(() => {
    jwks.stop();
  });

  afterAll(async () => {
    await connection.destroy();
  });
  describe("Given all fields", () => {
    it("should return 200 status code", async () => {
      const accessToken = jwks.token({ sub: "1", role: Roles.CUSTOMER });
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();
      expect(response.statusCode).toBe(200);
    });
    it("should return user data", async () => {
      //register user
      const userData = {
        firstName: "Ansar",
        lastName: "Shaikh",
        email: " ansarahmedn@gmail.com ",
        password: "password",
      };
      const userRepository = connection.getRepository(User);
      const data = await userRepository.save({
        ...userData,
        role: Roles.CUSTOMER,
      });
      //generate token
      const accessToken = jwks.token({ sub: String(data.id), role: data.role });
      // add token to cookie
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();
      // assert
      // user id is matches with registered user id
      expect((response.body as Record<string, string>).id).toBe(data.id);
    });
  });
});
