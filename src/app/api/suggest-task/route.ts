import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userInput } = body;

    if (!userInput) {
      return NextResponse.json({ error: 'User input is required' }, { status: 400 });
    }

    // Define the system message to instruct ChatGPT
    const systemMessage = `
      You are a highly intelligent and helpful AI assistant specialized in task management. Your goal is to take a user's raw task idea and transform it into a well-defined task with a clear title, detailed description, appropriate priority, a reasonable time estimate, and a suggested due date.

      Respond ONLY with a JSON object. Do not include any other text or markdown outside the JSON.

      The JSON object should have the following structure:
      {
        "title": "string", // A concise, improved title for the task. Correct spelling and grammar.
        "description": "string", // A detailed and actionable description for the task.
        "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT", // The estimated priority of the task.
        "timeEstimate": "number", // The estimated time to complete the task in minutes (integer).
        "dueDate": "string" // The suggested due date and time in ISO 8601 format (e.g., 2025-12-31T23:59:59.000Z). Default to null if not specified.
      }

      Example:
      User input: "fix bug in login by tomorrow"
      Response:
      {
        "title": "Fix Login Bug",
        "description": "Investigate and resolve the bug affecting the user login functionality. This includes identifying the root cause, implementing a fix, testing thoroughly, and deploying the solution.",
        "priority": "HIGH",
        "timeEstimate": 120,
        "dueDate": "${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()}"
      }
    `;

    // Call OpenAI Chat Completions API
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or 'gpt-4' for higher quality
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `User input: ${userInput}` },
      ],
      response_format: { type: "json_object" }, // Request JSON object response
      temperature: 0.7, // Adjust for creativity vs. consistency
    });

    const responseContent = chatCompletion.choices[0].message.content;

    if (!responseContent) {
      throw new Error('OpenAI did not return any content.');
    }

    // Parse the JSON response from ChatGPT
    const aiResponse = JSON.parse(responseContent);

    // Validate the structure of the AI response
    if (
      typeof aiResponse.title !== 'string' ||
      typeof aiResponse.description !== 'string' ||
      !['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(aiResponse.priority) ||
      typeof aiResponse.timeEstimate !== 'number' ||
      (aiResponse.dueDate !== null && typeof aiResponse.dueDate !== 'string')
    ) {
      throw new Error('OpenAI response did not match expected structure.');
    }

    return NextResponse.json(aiResponse);
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Error in suggest-task API:', error);
    // Provide more specific error details if possible
    if (error.response) {
      console.error('OpenAI API Error Status:', error.response.status);
      console.error('OpenAI API Error Data:', error.response.data);
      return NextResponse.json({ error: 'OpenAI API Error', details: error.response.data }, { status: error.response.status });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error.message || 'Unknown error' }, { status: 500 });
  }
}
