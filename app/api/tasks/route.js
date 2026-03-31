import { NextResponse } from "next/server";
import { getPrisma } from "../../../lib/prisma";

const QUADRANTS = new Set([
  "high-priority-high-importance",
  "high-priority",
  "general",
  "high-importance",
]);

export async function GET() {
  const prisma = getPrisma();
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const taskText = typeof body.task === "string" ? body.task.trim() : "";
    const title = taskText || (typeof body.title === "string" ? body.title.trim() : "");
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const quadrant = typeof body.quadrant === "string" ? body.quadrant : "";

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!QUADRANTS.has(quadrant)) {
      return NextResponse.json({ error: "Invalid quadrant" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        quadrant,
        status: "todo",
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}