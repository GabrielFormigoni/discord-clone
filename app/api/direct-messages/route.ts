import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

import { DirectMessage } from "@prisma/client";
import { db } from "@/lib/db";

const BATCH_SIZE = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);

    const conversationId = searchParams.get("conversationId");
    const cursor = searchParams.get("cursor");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("Conversation Id missing", { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: BATCH_SIZE,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: BATCH_SIZE,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === BATCH_SIZE) {
      nextCursor = messages[BATCH_SIZE - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("DIRECT_MESAGES_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
