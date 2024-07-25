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
