'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function TaskDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/tasks/${id}`)
        .then(res => res.json())
        .then(data => setTask(data))
        .catch(console.error);
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        router.push('/tasks/active');
      } catch (error) {
        console.error('Failed to delete task', error);
      }
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
            <div className="flex items-center mb-4">
              <span className={`text-sm font-bold uppercase px-3 py-1 rounded-full ${priorityStyles[task.priority]}`}>{task.priority}</span>
              <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">{task.status}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/tasks/${id}/edit`}>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Edit</button>
            </Link>
            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">Delete</button>
          </div>
        </div>
        {task.description && <p className="text-lg mb-4">{task.description}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Time Estimate</p>
            <p>{task.timeEstimate} minutes</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
            <p>{task.dueDate ? new Date(task.dueDate).toLocaleString() : 'Not set'}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
          <p>{new Date(task.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
