import { Request } from "express";

export interface userData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface registerUserRequest extends Request {
  body: userData;
}

export interface TokenPayload {
  sub: string;
  payload: string;
  role: string;
}

export type AuthCookie = {
  accessToken: string;
  refreshToken: string;
};

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
    id?: string;
    tenant: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface IRefreshTokenPayload {
  id: string;
}

export interface ITenant {
  name: string;
  address: string;
}

export interface CreateTenantRequest extends Request {
  body: ITenant;
}
