import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/AuthCountroller";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";

import registerValidator from "../validators/register-validator";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
import loginValidators from "../validators/login-validators";
import { CredentialService } from "../services/CredentialService";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();
const authController = new AuthController(
  userService,
  logger,
  tokenService,
  credentialService,
);

router.post(
  "/register",
  registerValidator,
  async (req: Request, res: Response, next: NextFunction) =>
    await authController.register(req, res, next),
);
router.post(
  "/login",
  loginValidators,
  async (req: Request, res: Response, next: NextFunction) =>
    await authController.login(req, res, next),
);

export default router;
