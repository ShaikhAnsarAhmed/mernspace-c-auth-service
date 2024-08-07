import express, { NextFunction, RequestHandler, Response } from "express";

import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entity/Tenant";
import logger from "../config/logger";

import { TenantService } from "../services/TenantService";
import { TenantController } from "../controllers/TenantController";
import { CreateTenantRequest } from "../types";

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post(
  "/",
  (req: CreateTenantRequest, res: Response, next: NextFunction) =>
    tenantController.create(req, res, next) as unknown as RequestHandler,
);

export default router;
