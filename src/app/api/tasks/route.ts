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

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Creates a new task.
 *     description: Adds a new task to the database with a title, description, priority, time estimate, and an optional due date. Logs the task creation event.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task.
 *                 example: "Buy groceries"
 *               description:
 *                 type: string
 *                 description: A detailed description of the task.
 *                 nullable: true
 *                 example: "Milk, eggs, bread, and vegetables."
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *                 description: The priority of the task.
 *                 default: MEDIUM
 *               timeEstimate:
 *                 type: number
 *                 description: The estimated time to complete the task in minutes.
 *                 default: 30
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: The optional due date and time for the task (ISO 8601 format).
 *     responses:
 *       201:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                   nullable: true
 *                 status:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 timeEstimate:
 *                   type: number
 *                 dueDate:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 completedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       400:
 *         description: Bad Request - Title is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Title is required"
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

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieves all tasks.
 *     description: Returns a list of all tasks, ordered by creation date in descending order.
 *     responses:
 *       200:
 *         description: An array of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                     nullable: true
 *                   status:
 *                     type: string
 *                   priority:
 *                     type: string
 *                   timeEstimate:
 *                     type: number
 *                   dueDate:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   completedAt:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
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
