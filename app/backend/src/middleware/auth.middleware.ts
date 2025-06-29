import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import User from "../models/user.model";

// Define a custom interface for our token's payload
interface CustomPayload extends JwtPayload {
  id: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // If token is not provided, return unauthorized response
      if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
      }

      // Verify the token, casting to unknown first to satisfy TypeScript's strictness
      const decoded = jwt.verify(token, config.jwt_secret) as CustomPayload;

      // Check if the decoded payload has the id
      if (!decoded || !decoded.id) {
        return res
          .status(401)
          .json({ message: "Not authorized, token is invalid" });
      }

      // Get user from the token's payload and attach it to the request object
      // We exclude the password when fetching the user
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      // Attach the found user to the request object
      req.user = user;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
