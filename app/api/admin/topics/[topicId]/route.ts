import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { topicId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topic = await prisma.topic.findUnique({
      where: { id: params.topicId },
      include: {
        chapter: {
          include: {
            class: true,
          },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Get topic error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { topicId: string } }
) {
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

    const updatedTopic = await prisma.topic.update({
      where: { id: params.topicId },
      data: {
        chapterId,
        title,
        content,
        order: parseInt(order),
      },
    });

    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error("Update topic error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

