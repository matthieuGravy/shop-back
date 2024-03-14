import { jwtVerify } from "jose";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    // Convertir la clé secrète en Uint8Array
    const secretKey = new TextEncoder().encode(
      process.env.SESSION_SECRET as string
    );

    const { payload } = await jwtVerify(token, secretKey);
    req.user = payload;
    return next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}

export default authMiddleware;
