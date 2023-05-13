import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { userAuthSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = userAuthSchema.parse(body);
    const { email, name, password } = payload;

    if (!email || !name || !password) {
      return new NextResponse("Missing credentials", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    throw new NextResponse("Internal error", { status: 500 });
  }
}
