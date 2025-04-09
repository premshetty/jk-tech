// app/api/users/route.ts
import { mockUsers } from "@/lib/auth";
import { NextResponse } from "next/server";

let users = mockUsers;

// Get users (GET)
export async function GET() {
  return NextResponse.json(users);
}

// Update user role (PATCH)
export async function PATCH(req: Request) {
  const { id, role } = await req.json();

  users = users.map((user) => (user.id === id ? { ...user, role } : user));

  return NextResponse.json({ success: true });
}

// Delete user (DELETE)
export async function DELETE(req: Request) {
  const { id } = await req.json();

  users = users.filter((user) => user.id !== id);

  return NextResponse.json({ success: true });
}
