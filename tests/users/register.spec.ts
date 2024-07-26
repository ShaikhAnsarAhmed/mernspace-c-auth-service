import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";

import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
describe("POST auth/register", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // database truncate
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("Given all fields", () => {
    it("should return 201 status code", async () => {
      // Arrange
      const userData = {
        firstName: "Ansar",
        lastName: "Shaikh",
        email: "ansar@gmail.com",
        password: "password",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(response.statusCode).toBe(201);
    });
    it("should return valid json response", async () => {
      // Arrange
      const userData = {
        firstName: "Ansar",
        lastName: "Shaikh",
        email: "ansar@gmail.com",
        password: "password",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(
        (response.headers as Record<string, string>)["content-type"],
      ).toEqual(expect.stringContaining("json"));
    });
    it("should persist user in the database", async () => {
      // Arrange
      const userData = {
        firstName: "Ansar",
        lastName: "Shaikh",
        email: "ansar@gmail.com",
        password: "password",
      };

      // Act
      await request(app).post("/auth/register").send(userData);
      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });
    it("should return an id of the created user", async () => {
      // Arrange
      const userData = {
        firstName: "Ansar",
        lastName: "shaikh",
        email: "rakesh@mern.space",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.body).toHaveProperty("id");
      const repository = connection.getRepository(User);
      const users = await repository.find();
      expect((response.body as Record<string, string>).id).toBe(users[0].id);
    });
    it("should assign a customer role", async () => {
      // Arrange
      const userData = {
        firstName: "Ansar",
        lastName: "Shaikh",
        email: "ansar@gmail.com",
        password: "password",
      };

      // Act
      await request(app).post("/auth/register").send(userData);
      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty("role");
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });
    it("should store hashed password", async () => {
      // Arrange
      const userData = {
        firstName: "Ansar",
        lastName: "Shaikh",
        email: "ansar@gmail.com",
        password: "password",
      };

      // Act
      await request(app).post("/auth/register").send(userData);
      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0].password).not.toBe(userData.password);
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
    });
    it("should return 400 status code if email is already exist", async () => {
      // Arrange
      const userData = {
        firstName: "Ansar",
        lastName: "Shaikh",
        email: "ansar@gmail.com",
        password: "password",
      };
      const userRepository = connection.getRepository(User);
      await userRepository.save({ ...userData, role: Roles.CUSTOMER });

      // Act
      const response = await request(app).post("/auth/register").send(userData);
      const users = await userRepository.find();
      // Assert

      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(1);
    });
  });
  describe("fields are Missing", () => {
    it("should return 400 status code if email field is missing", async () => {
      // Arrange
      const userData = {
        firstName: "Ansar",
        lastName: "Shaikh",
        email: "",
        password: "password",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
    it("should return a status code 400 if firstName is missing", async () => {
      // Arrange
      const userData = {
        firstName: "",
        lastName: "Shaikh",
        email: "ansarahmedn@gmail.com",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(response.statusCode).toBe(400);
    });
    it("should return a status code 400 if lastName is missing", async () => {
      // Arrange
      const userData = {
        firstName: "Ansar",
        lastName: "",
        email: "ansarahmedn@gmail.com",
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(response.statusCode).toBe(400);
    });
    it("should return a status code 400 if password is missing", async () => {
      // Arrange
      const userData = {
        firstName: "Ansar",
        lastName: "Shaikh",
        email: "ansarahmedn@gmail.com",
        password: "",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(response.statusCode).toBe(400);
    });
  });
  describe("fields are not in proper format", () => {
    it("should trim the email field", async () => {
      // Arrange
      const userData = {
        firstName: "Ansar",
        lastName: "Shaikh",
        email: " ansarahmedn@gmail.com ",
        password: "password",
      };

      // Act
      await request(app).post("/auth/register").send(userData);
      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      const user = users[0];
      expect(user.email).toBe("ansarahmedn@gmail.com");
    });
    it("should return 400 status code if email is not a valid email", async () => {
      // Arrange
      const userData = {
        firstName: "ansar",
        lastName: "shaikh",
        email: "rakesh_mern.space", // Invalid email
        password: "password",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
    it("should return 400 status code if password length is less than 8 chars", async () => {
      // Arrange
      const userData = {
        firstName: "Ansar",
        lastName: "shaikh",
        email: "rakesh@mern.space",
        password: "pass", // less than 8 chars
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // console.log(response.body);

      // Assert
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
  });
});
