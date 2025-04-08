export const mockUsers: User[] = [
  { id: 1, email: "admin@example.com", password: "admin123", role: "admin" },
  { id: 2, email: "user@example.com", password: "user123", role: "user" },
];

export type User = {
  id: number;
  email: string;
  password: string;
  role?: "admin" | "user"; 
};

export function generateToken(user: User) {
  return Buffer.from(
    JSON.stringify({ email: user.email, role: user.role })
  ).toString("base64");
}

export function verifyToken(token: string | undefined) {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}



export function authenticateUser(email: string, password: string) {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );
  return user || null;
}