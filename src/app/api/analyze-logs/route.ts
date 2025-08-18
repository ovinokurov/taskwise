import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const logFilePath = path.join(process.cwd(), 'analytics.log');

export async function GET() {
  try {
    const logFileContent = await fs.readFile(logFilePath, 'utf-8');

    if (!logFileContent.trim()) {
      return NextResponse.json({ report: "No activity logged yet. Complete some tasks to generate a report." });
    }

    // Define the system message for the report generation
    const systemMessage = `
      You are an expert productivity analyst. Your task is to analyze a log of user task events (creation and completion) and generate a comprehensive, detailed, and actionable report. The report should provide deep insights into the user's task management habits, productivity patterns, and areas for improvement.

      Your response MUST be a JSON object with the following structure. Ensure all data is derived SOLELY from the provided log entries. Do not invent data.

      {
        "summaryText": "string", // A detailed, markdown-formatted textual summary of the user's productivity (min 300 words). It should cover overall trends, task breakdowns, time analysis, strengths, weaknesses, and actionable recommendations.
        "keyMetrics": { // Key numerical metrics for quick overview.
          "totalCreated": number,
          "totalCompleted": number,
          "completionRate": number, // Percentage, e.g., 75.5
          "averageOverallCompletionTime": number // In minutes, e.g., 60.5
        },
        "chartData": { // Structured data for charts.
          "tasksByPriority": { // Example: {"LOW": {"created": 5, "completed": 3}, ...}
            "LOW": {"created": number, "completed": number},
            "MEDIUM": {"created": number, "completed": number},
            "HIGH": {"created": number, "completed": number},
            "URGENT": {"created": number, "completed": number}
          },
          "tasksByCategory": { // Example: {"Development": {"created": 10, "completed": 8}, ...}
            "CategoryName": {"created": number, "completed": number}
          },
          "avgCompletionTimes": { // Example: {"Development-HIGH": "120.5", ...}
            "Category-Priority": "string" // Average time in minutes, as a string with one decimal place.
          }
        },
        "categorizedTasksGrid": [ // Data for a grid/table of tasks by category.
          {
            "category": "string",
            "created": number,
            "completed": number,
            "completionRate": number, // Percentage
            "avgTime": number // Average time in minutes for completed tasks in this category
          }
        ],
        "insights": ["string"] // An array of actionable insights and suggestions for the user (at least 5 distinct, detailed, and actionable points based on the data).
      }

      Analyze the provided log entries (JSONL format) and generate the report.
      For "categorizedTasksGrid", categorize tasks based on keywords in their title/description (e.g., "report", "analysis" -> "Reporting & Analysis"; "code", "develop" -> "Development"; "meeting", "schedule" -> "Meetings & Coordination"; "grill", "cook", "food" -> "Cooking & Meals"; "fix", "repair" -> "Maintenance & Repair"; "clean", "organize" -> "Housekeeping"; "exercise", "workout" -> "Health & Fitness"; otherwise "General").
      Ensure all numerical values are actual numbers, not strings, unless specified (like avgCompletionTimes).
      Calculate completion rates and average times accurately.
      Provide at least 5 distinct, detailed, and actionable insights in the "insights" array.
    `;

    // Call OpenAI Chat Completions API
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or 'gpt-4' for higher quality
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Log entries (JSONL format):\n${logFileContent}` },
      ],
      response_format: { type: "json_object" }, // Request JSON object response
      temperature: 0.7, // Adjust for creativity vs. consistency
    });

    const responseContent = chatCompletion.choices[0].message.content;

    if (!responseContent) {
      throw new Error('OpenAI did not return any content.');
    }

    // Parse the JSON response from ChatGPT
    const reportData = JSON.parse(responseContent);

    // Basic validation of the structure (more robust validation can be added)
    if (
      typeof reportData.summaryText !== 'string' ||
      typeof reportData.chartData !== 'object' ||
      !Array.isArray(reportData.insights)
    ) {
      throw new Error('OpenAI report response did not match expected structure.');
    }

    return NextResponse.json({ report: reportData });

  } catch (error: any) {
    console.error('Error in analyze-logs API:', error);
    if (error.code === 'ENOENT') {
      return NextResponse.json({ report: "No activity has been logged yet. Complete some tasks first." });
    }
    if (error.response) {
      console.error('OpenAI API Error Status:', error.response.status);
      console.error('OpenAI API Error Data:', error.response.data);
      return NextResponse.json({ error: 'OpenAI API Error', details: error.response.data }, { status: error.response.status });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error.message || 'Unknown error' }, { status: 500 });
  }
}