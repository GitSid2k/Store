import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dub-stal-secret-dev-key-change-in-prod"
);
const COOKIE = "ds_session";
const EXPIRES = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  userId: string;
  name: string;
  email: string;
};

export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRES}s`)
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: EXPIRES,
    path: "/",
  };
}

export function clearCookieOptions() {
  return {
    name: COOKIE,
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  };
}
