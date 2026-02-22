import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { chapterId, title, content, order } = body;

    if (!chapterId || !title || !content || order === undefined) {
      return NextResponse.json(
        { error: "Chapter, title, content, and order are required" },
        { status: 400 }
      );
    }

    const newTopic = await prisma.topic.create({
      data: {
        chapterId,
        title,
        content,
        order: parseInt(order),
      },
    });

    return NextResponse.json(newTopic, { status: 201 });
  } catch (error) {
    console.error("Create topic error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topics = await prisma.topic.findMany({
      include: {
        chapter: {
          include: {
            class: true,
          },
        },
      },
      orderBy: [
        { chapter: { class: { type: "asc" } } },
        { chapter: { order: "asc" } },
        { order: "asc" },
      ],
    });

    return NextResponse.json(topics);
  } catch (error) {
    console.error("Get topics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

