'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

// Types & Constants
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
type Status = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

const priorityStyles: Record<Priority, string> = {
  LOW: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  MEDIUM: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  HIGH: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  timeEstimate: number;
  dueDate: string | null;
  createdAt: string;
}

export default function ActiveTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      setTasks(await response.json());
    } catch (error) { console.error(error); }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCompleteTask = async (taskId: string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'COMPLETED' }) });
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const { activeTasks, completedTasks } = useMemo(() => tasks.reduce<{ activeTasks: Task[]; completedTasks: Task[] }>((acc, task) => {
    (task.status === 'COMPLETED' ? acc.completedTasks : acc.activeTasks).push(task);
    return acc;
  }, { activeTasks: [], completedTasks: [] }), [tasks]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/tasks/new">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              Add a New Task
            </button>
          </Link>
        </div>

        {/* --- Task Lists --- */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Active Tasks ({activeTasks.length})</h2>
          <div className="space-y-4">
            {activeTasks.length > 0 ? activeTasks.map(task => (
              <Link href={`/tasks/${task.id}`} key={task.id}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="flex-grow">
                    <p className="font-bold">{task.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
                    {task.dueDate && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Due: {new Date(task.dueDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs font-bold uppercase px-2 py-1 rounded-full inline-block ${priorityStyles[task.priority]}`}>{task.priority}</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{task.timeEstimate} min</p>
                    <button onClick={(e) => { e.preventDefault(); handleCompleteTask(task.id); }} className="mt-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-1 px-3 rounded-lg">✓ Complete</button>
                  </div>
                </div>
              </Link>
            )) : <p className="text-center text-gray-500 py-8">No active tasks!</p>}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Completed Tasks ({completedTasks.length})</h2>
          <div className="space-y-4">
            {completedTasks.length > 0 ? completedTasks.map(task => (
              <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between gap-4 opacity-60">
                <p className="font-bold line-through">{task.title}</p>
                <div className={`text-xs font-bold uppercase px-2 py-1 rounded-full inline-block ${priorityStyles[task.priority]}`}>{task.priority}</div>
              </div>
            )) : <p className="text-center text-gray-500 py-8">No completed tasks yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
