import { NextResponse } from "next/server";
import { getPrisma } from "../../../../lib/prisma";

export async function PATCH(request, { params }) {
  const id = params?.id;
  const prisma = getPrisma();

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Task id is required" }, { status: 400 });
  }

  try {
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const body = await request.json();
    const updates = {};

    if (typeof body.task === "string" || typeof body.title === "string") {
      const nextTitle = typeof body.task === "string" ? body.task : body.title;
      const cleanTitle = nextTitle.trim();
      if (!cleanTitle) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
      }
      updates.title = cleanTitle;
    }

    if (typeof body.description === "string") {
      updates.description = body.description.trim();
    }

    if (body.status === "done") {
      updates.status = "done";
      updates.completedAt = new Date();
    }

    const task = await prisma.task.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const id = params?.id;
  const prisma = getPrisma();

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Task id is required" }, { status: 400 });
  }

  try {
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}