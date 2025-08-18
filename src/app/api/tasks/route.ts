import { NextResponse } from 'next/server';
import { PrismaClient, Priority } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();
const logFilePath = path.join(process.cwd(), 'analytics.log');

async function logEvent(event: object) {
  const logEntry = `${JSON.stringify({ timestamp: new Date().toISOString(), ...event })}\n`;
  try {
    await fs.appendFile(logFilePath, logEntry);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, priority, timeEstimate, dueDate } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Ensure timeEstimate is a valid integer, otherwise default to 30
    const finalTimeEstimate = timeEstimate && !isNaN(parseInt(timeEstimate)) ? parseInt(timeEstimate) : 30;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority as Priority,
        timeEstimate: finalTimeEstimate,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    await logEvent({ event: 'TASK_CREATED', taskId: task.id, details: task });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
