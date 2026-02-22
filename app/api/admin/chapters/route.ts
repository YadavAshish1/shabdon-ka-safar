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
    const { classId, title, description, order } = body;

    if (!classId || !title || order === undefined) {
      return NextResponse.json(
        { error: "Class, title, and order are required" },
        { status: 400 }
      );
    }

    const newChapter = await prisma.chapter.create({
      data: {
        classId,
        title,
        description: description || null,
        order: parseInt(order),
      },
    });

    return NextResponse.json(newChapter, { status: 201 });
  } catch (error) {
    console.error("Create chapter error:", error);
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

    const chapters = await prisma.chapter.findMany({
      include: {
        class: true,
        _count: {
          select: { topics: true },
        },
      },
      orderBy: [
        { class: { type: "asc" } },
        { order: "asc" },
      ],
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.error("Get chapters error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

