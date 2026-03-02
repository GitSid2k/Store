import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, sessionCookieOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json() as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Введите email и пароль." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Неверный email или пароль." }, { status: 401 });
    }

    const valid = await compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Неверный email или пароль." }, { status: 401 });
    }

    const token = await createSession({ userId: user.id, name: user.name, email: user.email });
    const res = NextResponse.json({ ok: true, name: user.name });
    res.cookies.set(sessionCookieOptions(token));
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера." }, { status: 500 });
  }
}
