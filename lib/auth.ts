export const mockUsers: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john.doe@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 4,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 5,
    name: "Bob Brown",
    email: "bob.brown@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 6,
    name: "Charlie Davis",
    email: "charlie.davis@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 7,
    name: "Diana Evans",
    email: "diana.evans@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 8,
    name: "Ethan Garcia",
    email: "ethan.garcia@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 9,
    name: "Fiona Hall",
    email: "fiona.hall@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 10,
    name: "George King",
    email: "george.king@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 11,
    name: "Hannah Lee",
    email: "hannah.lee@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 12,
    name: "Ivan Martinez",
    email: "ivan.martinez@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 13,
    name: "Jasmine Nguyen",
    email: "jasmine.nguyen@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 14,
    name: "Kevin Ortiz",
    email: "kevin.ortiz@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 15,
    name: "Lily Patel",
    email: "lily.patel@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 16,
    name: "Mike Quinn",
    email: "mike.quinn@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 17,
    name: "Nora Rivera",
    email: "nora.rivera@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 18,
    name: "Oscar Singh",
    email: "oscar.singh@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 19,
    name: "Priya Thomas",
    email: "priya.thomas@example.com",
    password: "user123",
    role: "user",
  },
  {
    id: 20,
    name: "Raj Verma",
    email: "raj.verma@example.com",
    password: "user123",
    role: "user",
  },
];

export type User = {
  id: number;
  email: string;
  name: string;
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
