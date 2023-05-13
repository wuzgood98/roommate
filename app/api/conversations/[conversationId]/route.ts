import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { pusherServer } from "@/lib/pusher";

export async function DELETE(
  request: Request,
  { params }: { params: { conversationId?: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation.users.forEach(async(user)=> {
      if(user.email) {
        await pusherServer.trigger(user.email, "conversation:delete", existingConversation)
      }
    })

    return NextResponse.json(deletedConversation);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
