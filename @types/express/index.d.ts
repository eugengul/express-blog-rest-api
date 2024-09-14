import { User } from "@prisma/client";

// Request can have user if you use validateAccessToken middleware
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
