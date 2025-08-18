import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    const events = tasks.map(task => ({
      id: task.id,
      title: task.title,
      start: task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt),
      end: task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt),
    }));
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching tasks for calendar:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
