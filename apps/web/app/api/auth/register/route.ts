import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, sessionCookieOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json() as { name: string; email: string; password: string };

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json({ error: "Заполните все поля. Пароль — минимум 6 символов." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует." }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, passwordHash } });

    const token = await createSession({ userId: user.id, name: user.name, email: user.email });
    const res = NextResponse.json({ ok: true }, { status: 201 });
    res.cookies.set(sessionCookieOptions(token));
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера." }, { status: 500 });
  }
}
