import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { updatedUserSchema } from "@/lib/validations/updatedUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const payload = updatedUserSchema.parse(body);
    const { name, image } = payload;

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image,
        name,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error, "Error message");
    return new NextResponse("Error", { status: 500 });
  }
}
