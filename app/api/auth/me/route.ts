import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/lib/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;
  const user = verifyToken(token);

  if (!user) return res.status(401).json({ message: "Not authenticated" });

  res.status(200).json({ user });
}
