import { NextApiRequest, NextApiResponse } from "next";
import "../types/next"; // Ensure the custom type is loaded
import { verifyToken } from "./auth";

export function requireAuth(
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.token;
    const user = verifyToken(token);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    (req as NextApiRequest & { user: typeof user }).user = user;
    return handler(req, res);
  };
}
