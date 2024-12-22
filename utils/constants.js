export const Domain = "http://localhost:5000";
export const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_JWT_SECRET || ""
);
