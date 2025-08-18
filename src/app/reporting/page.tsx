'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ReportData {
  summaryText: string;
  keyMetrics: {
    totalCreated: number;
    totalCompleted: number;
    completionRate: number;
    averageOverallCompletionTime: number;
  };
  chartData: {
    tasksByPriority: Record<string, { created: number; completed: number }>;
    tasksByCategory: Record<string, { created: number; completed: number }>;
    avgCompletionTimes: Record<string, string>;
  };
  categorizedTasksGrid: {
    category: string;
    created: number;
    completed: number;
    completionRate: number;
    avgTime: number;
  }[];
  insights: string[];
}

export default function ReportingPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false); // State for expand/collapse
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(false); // New state for insights accordion
  const [isPriorityChartExpanded, setIsPriorityChartExpanded] = useState(false);
  const [isCategoryChartExpanded, setIsCategoryChartExpanded] = useState(false);
  const [isAvgTimeChartExpanded, setIsAvgTimeChartExpanded] = useState(false);
  const [isCategorizedGridExpanded, setIsCategorizedGridExpanded] = useState(false); // New state for categorized grid

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReport(null);
    setError(null);
    try {
      const response = await fetch('/api/analyze-logs');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate report');
      }
      const data = await response.json();
      setReport(data.report);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error: Could not generate the report.');
    } finally {
      setIsLoading(false);
    }
  };

  // Chart Data Preparation (unchanged)
  const getPriorityChartData = () => {
    if (!report) return { labels: [], datasets: [] };
    const labels = Object.keys(report.chartData.tasksByPriority);
    const createdData = labels.map(p => report.chartData.tasksByPriority[p].created);
    const completedData = labels.map(p => report.chartData.tasksByPriority[p].completed);

    return {
      labels,
      datasets: [
        {
          label: 'Created',
          data: createdData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Completed',
          data: completedData,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    };
  };

  const getCategoryPieChartData = () => {
    if (!report) return { labels: [], datasets: [] };
    const labels = Object.keys(report.chartData.tasksByCategory);
    const completedData = labels.map(c => report.chartData.tasksByCategory[c].completed);

    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#50C878', '#C0C0C0'
    ];

    return {
      labels,
      datasets: [
        {
          data: completedData,
          backgroundColor: backgroundColors.slice(0, labels.length),
          hoverOffset: 4,
        },
      ],
    };
  };

  const getAvgCompletionTimeChartData = () => {
    if (!report) return { labels: [], datasets: [] };
    const labels = Object.keys(report.chartData.avgCompletionTimes);
    const data = labels.map(key => parseFloat(report.chartData.avgCompletionTimes[key]));

    return {
      labels,
      datasets: [
        {
          label: 'Avg. Completion Time (mins)',
          data: data,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
        },
      ],
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Generate Productivity Report</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Click the button below to have AI analyze your tasks and generate an overview of your activity.
          </p>
          <button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'AI is Analyzing...' : 'Generate Report'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-center">{error}</div>
          )}

          {report && (
            <div className="mt-8">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tasks Created</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{report.keyMetrics.totalCreated}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tasks Completed</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{report.keyMetrics.totalCompleted}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{report.keyMetrics.completionRate}%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Time per Task</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{report.keyMetrics.averageOverallCompletionTime} min</p>
                </div>
              </div>

              {/* Summary Text Accordion */}
              <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <button
                  onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                  className="w-full text-left font-bold text-xl mb-2 text-gray-800 dark:text-gray-100 flex justify-between items-center"
                >
                  <span>✨ AI Analysis Report</span>
                  <span>{isSummaryExpanded ? '▲' : '▼'}</span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isSummaryExpanded ? 'max-h-screen' : 'max-h-0' // Adjust max-h as needed
                  }`}
                >
                  <div className="prose dark:prose-invert max-w-none pt-2">
                    <ReactMarkdown>{report.summaryText}</ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 gap-8 mb-8">
                {/* Tasks by Priority Chart Accordion */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <button
                    onClick={() => setIsPriorityChartExpanded(!isPriorityChartExpanded)}
                    className="w-full text-left font-bold text-lg mb-2 text-gray-800 dark:text-gray-100 flex justify-between items-center"
                  >
                    <span>Tasks by Priority</span>
                    <span>{isPriorityChartExpanded ? '▲' : '▼'}</span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isPriorityChartExpanded ? 'max-h-screen' : 'max-h-0'
                    }`}
                  >
                    <div className="pt-2">
                      <Bar data={getPriorityChartData()} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Tasks Created vs. Completed by Priority' } } }} />
                    </div>
                  </div>
                </div>

                {/* Completed Tasks by Category Chart Accordion */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <button
                    onClick={() => setIsCategoryChartExpanded(!isCategoryChartExpanded)}
                    className="w-full text-left font-bold text-lg mb-2 text-gray-800 dark:text-gray-100 flex justify-between items-center"
                  >
                    <span>Completed Tasks by Category</span>
                    <span>{isCategoryChartExpanded ? '▲' : '▼'}</span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isCategoryChartExpanded ? 'max-h-screen' : 'max-h-0'
                    }`}
                  >
                    <div className="pt-2 relative w-64 h-64 mx-auto"> {/* Fixed size container, centered */} 
                      <Pie data={getCategoryPieChartData()} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Completed Tasks Distribution by Category' } } }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Average Completion Time Chart Accordion */}
              <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <button
                  onClick={() => setIsAvgTimeChartExpanded(!isAvgTimeChartExpanded)}
                  className="w-full text-left font-bold text-lg mb-2 text-gray-800 dark:text-gray-100 flex justify-between items-center"
                >
                  <span>Average Completion Time</span>
                  <span>{isAvgTimeChartExpanded ? '▲' : '▼'}</span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isAvgTimeChartExpanded ? 'max-h-screen' : 'max-h-0'
                  }`}
                >
                  <div className="pt-2">
                    <Bar data={getAvgCompletionTimeChartData()} options={{ responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Average Completion Time by Category & Priority' } } }} />
                  </div>
                </div>
              </div>

              {/* Categorized Tasks Grid/Table */}
              {report.categorizedTasksGrid && report.categorizedTasksGrid.length > 0 && (
                <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <button
                    onClick={() => setIsCategorizedGridExpanded(!isCategorizedGridExpanded)}
                    className="w-full text-left font-bold text-lg mb-2 text-gray-800 dark:text-gray-100 flex justify-between items-center"
                  >
                    <span>Detailed Task Categories</span>
                    <span>{isCategorizedGridExpanded ? '▲' : '▼'}</span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isCategorizedGridExpanded ? 'max-h-screen' : 'max-h-0'
                    }`}
                  >
                    <div className="pt-2 overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Created</th>
                            <th scope="col" className="px-6 py-3">Completed</th>
                            <th scope="col" className="px-6 py-3">Completion Rate</th>
                            <th scope="col" className="px-6 py-3">Avg. Time (min)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.categorizedTasksGrid.map((item, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.category}</td>
                              <td className="px-6 py-4">{item.created}</td>
                              <td className="px-6 py-4">{item.completed}</td>
                              <td className="px-6 py-4">{item.completionRate.toFixed(1)}%</td>
                              <td className="px-6 py-4">{typeof item.avgTime === 'number' ? item.avgTime.toFixed(1) : 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Insights */}
              {report.insights && report.insights.length > 0 && (
                <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <button
                    onClick={() => setIsInsightsExpanded(!isInsightsExpanded)}
                    className="w-full text-left font-bold text-lg mb-2 text-gray-800 dark:text-gray-100 flex justify-between items-center"
                  >
                    <span>💡 Insights for Improvement</span>
                    <span>{isInsightsExpanded ? '▲' : '▼'}</span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isInsightsExpanded ? 'max-h-screen' : 'max-h-0' // Adjust max-h as needed
                    }`}
                  >
                    <ul className="list-disc list-inside text-sm space-y-1 leading-relaxed pt-2">
                      {report.insights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
