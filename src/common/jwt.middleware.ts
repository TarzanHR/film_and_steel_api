import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as jwt.Secret
      ) as {
        userId: number;
        username: string;
        admin: number;
      };

      req.query = {
        ...req.query,
        userId: decodedToken.userId.toString(),
        username: decodedToken.username,
        admin: decodedToken.admin.toString(),
      };

      next();
    } catch (error) {
      res.status(403).json({ error: "Invalid or expired token" });
    }
  } else {
    res.status(401).json({ error: "Authentication required" });
  }
};
