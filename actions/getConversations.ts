import { getCurrentUser } from "./getCurrentUser";
import prisma from "@/lib/prismadb";

export async function getConversations() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
            sender: true,
          },
        },
      },
    });

    return conversations;
  } catch (error: any) {
    return [];
  }
}
