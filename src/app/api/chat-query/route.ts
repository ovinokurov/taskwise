import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const prisma = new PrismaClient();
const logFilePath = path.join(process.cwd(), 'analytics.log');

/**
 * @swagger
 * /api/chat-query:
 *   post:
 *     summary: Answers user questions about tasks using AI.
 *     description: Receives a natural language question about tasks, fetches task data from the database and log entries, and uses an AI model (ChatGPT) to generate a comprehensive answer based on the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: The natural language question about tasks.
 *                 example: "How many tasks have I completed this week?"
 *     responses:
 *       200:
 *         description: AI-generated answer to the question.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *                   description: The AI's answer based on the task data.
 *       400:
 *         description: Bad Request - Question is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Question is required"
 *       500:
 *         description: Internal Server Error or OpenAI API Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // 1. Fetch all tasks from the database
    const allTasks = await prisma.task.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        timeEstimate: true,
        createdAt: true,
        completedAt: true,
      },
    });

    // 2. Read all log entries from analytics.log
    let logEntries: LogEntry[] = [];
    try {
      const logFileContent = await fs.readFile(logFilePath, 'utf-8');
      logEntries = logFileContent.trim().split('\n').map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          console.error('Error parsing log line in chat-query:', line, e);
          return null;
        }
      }).filter(Boolean) as LogEntry[];
    } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (e.code === 'ENOENT') {
        console.log('analytics.log not found for chat query.');
      } else {
        console.error('Error reading analytics.log for chat query:', e);
      }
    }

    // 3. Construct a comprehensive prompt for ChatGPT
    const systemMessage = `
      You are a helpful AI assistant specialized in analyzing user task data.
      The user will ask questions about their tasks. You have access to their task list (from a database) and a log of task events (creation and completion).
      Answer the user's questions based SOLELY on the provided data. If the data is insufficient to answer a question, state that clearly.
      Be concise and direct. Format your answers clearly.

      The current date and time is: ${new Date().toString()}. Use this information to answer any questions about dates and times.

      Here is the user's task data:

      --- Tasks (from database) ---
      ${JSON.stringify(allTasks, null, 2)}

      --- Task Events Log (from analytics.log) ---
      ${JSON.stringify(logEntries, null, 2)}

      --- End of Data ---
    `;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or 'gpt-4' for more complex analysis
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: question },
      ],
      temperature: 0.5, // Balance creativity and factual accuracy
    });

    const aiAnswer = chatCompletion.choices[0].message.content;

    if (!aiAnswer) {
      throw new Error('OpenAI did not return any content.');
    }

    return NextResponse.json({ answer: aiAnswer });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Error in chat-query API:', error);
    if (error.response) {
      console.error('OpenAI API Error Status:', error.response.status);
      console.error('OpenAI API Error Data:', error.response.data);
      return NextResponse.json({ error: 'OpenAI API Error', details: error.response.data }, { status: error.response.status });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error.message || 'Unknown error' }, { status: 500 });
  }
}
