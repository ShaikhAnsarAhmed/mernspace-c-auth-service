import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { AuthController } from "../controllers/AuthCountroller";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";

import registerValidator from "../validators/register-validator";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
import { CredentialService } from "../services/CredentialService";
import authenticate from "../middlewares/authenticate";
import { AuthRequest } from "../types";
import validateRefreshToken from "../middlewares/validateRefreshToken";
import parseRefreshToken from "../middlewares/parseRefreshToken";
import loginValidator from "../validators/login-validator";

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
  loginValidator,
  async (req: Request, res: Response, next: NextFunction) =>
    await authController.login(req, res, next),
);
router.get(
  "/self",
  authenticate as RequestHandler,
  (req: Request, res: Response) =>
    authController.self(req as AuthRequest, res) as unknown as RequestHandler,
);
router.post(
  "/refresh",
  validateRefreshToken,
  (req: Request, res: Response, next: NextFunction) =>
    authController.refresh(req as AuthRequest, res, next),
);
router.post(
  "/logout",
  authenticate as RequestHandler,
  parseRefreshToken,
  (req: Request, res: Response, next: NextFunction) =>
    authController.logout(req as AuthRequest, res, next),
);

export default router;
