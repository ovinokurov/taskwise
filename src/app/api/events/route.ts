import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieves task events for calendar display.
 *     description: Fetches all tasks from the database and transforms them into a format suitable for a calendar, using `dueDate` or `createdAt` for start/end times.
 *     responses:
 *       200:
 *         description: An array of task events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the task.
 *                   title:
 *                     type: string
 *                     description: The title of the task.
 *                   start:
 *                     type: string
 *                     format: date-time
 *                     description: The start date and time of the event (ISO 8601 format).
 *                   end:
 *                     type: string
 *                     format: date-time
 *                     description: The end date and time of the event (ISO 8601 format).
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
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
