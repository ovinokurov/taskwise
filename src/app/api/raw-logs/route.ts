import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'analytics.log');

export async function GET() {
  try {
    const logFileContent = await fs.readFile(logFilePath, 'utf-8');
    if (!logFileContent.trim()) {
      return NextResponse.json([]); // Return empty array if no logs
    }
    const logEntries = logFileContent.trim().split('\n').map(line => {
      try {
        return JSON.parse(line);
      } catch (parseError) {
        console.error('Error parsing log line in raw-logs API:', line, parseError);
        return null; // Skip malformed lines
      }
    }).filter(Boolean); // Remove null entries
    return NextResponse.json(logEntries);
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Error in raw-logs API:', error);
    if (error.code === 'ENOENT') {
      return NextResponse.json([]); // Return empty array if file not found
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error.message || 'Unknown error' }, { status: 500 });
  }
}