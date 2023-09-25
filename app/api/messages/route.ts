import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

import { Message } from "@prisma/client";
import { db } from "@/lib/db";

const BATCH_SIZE = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);

    const channelId = searchParams.get("channelId");
    const cursor = searchParams.get("cursor");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel Id missing", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: BATCH_SIZE,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
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
      messages = await db.message.findMany({
        take: BATCH_SIZE,
        where: {
          channelId,
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
    console.log("MESAGES_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
