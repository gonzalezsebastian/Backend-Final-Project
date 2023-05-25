import { Request } from "express";
import { login } from "../../types/user";

declare global {
  namespace Express {
    interface Request {
      user?: login;
    }
  }
}