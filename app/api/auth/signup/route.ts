// src/app/api/auth/signup/route.ts
import { generateToken, mockUsers, User } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const existingUser = mockUsers.find((u) => u.email === email);
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }
  const newUser: User = {
    id: mockUsers.length + 1,
    email,
    password,
    role: "user",
  };

  mockUsers.push(newUser);
  const token = generateToken(newUser);

  const response = NextResponse.json({
    message: "Signup successful",
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    },
  });

  response.cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return response;
}
