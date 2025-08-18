'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Types & Constants
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
type Status = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

interface TaskForm {
  title: string;
  description: string;
  priority: Priority;
  timeEstimate: number;
  dueDate: Date | null;
  status: Status;
}

export default function EditTaskPage() {
  const { id } = useParams();
  const router = useRouter();
  const [taskForm, setTaskForm] = useState<TaskForm>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    timeEstimate: 30,
    dueDate: null,
    status: 'TODO',
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/tasks/${id}`)
        .then(res => res.json())
        .then(data => {
          setTaskForm({
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
          });
        })
        .catch(console.error);
    }
  }, [id]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    try {
      await fetch(`/api/tasks/${id}`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ ...taskForm, timeEstimate: Number(taskForm.timeEstimate) })
      });
      router.push(`/tasks/${id}`);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
          <form onSubmit={handleUpdateTask}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Title</label>
                <input id="title" name="title" type="text" value={taskForm.title} onChange={handleFormChange} className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg py-2 px-4"/>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Priority</label>
                <select id="priority" name="priority" value={taskForm.priority} onChange={handleFormChange} className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg py-2 px-4">
                  <option>LOW</option>
                  <option>MEDIUM</option>
                  <option>HIGH</option>
                  <option>URGENT</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Description</label>
              <textarea id="description" name="description" value={taskForm.description} onChange={handleFormChange} rows={3} className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg py-2 px-4"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="timeEstimate" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Time Estimate (minutes)</label>
                <input id="timeEstimate" name="timeEstimate" type="number" value={taskForm.timeEstimate} onChange={handleFormChange} className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg py-2 px-4"/>
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Due Date</label>
                <DatePicker
                  selected={taskForm.dueDate}
                  onChange={(date: Date | null) => setTaskForm(prev => ({ ...prev, dueDate: date }))}
                  showTimeSelect
                  dateFormat="Pp"
                  className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg py-2 px-4"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Status</label>
              <select id="status" name="status" value={taskForm.status} onChange={handleFormChange} className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg py-2 px-4">
                <option>TODO</option>
                <option>IN_PROGRESS</option>
                <option>COMPLETED</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Update Task</button>
          </form>
        </div>
      </div>
    </div>
  );
}
