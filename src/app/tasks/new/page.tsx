'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Types & Constants
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface TaskForm {
  title: string;
  description: string;
  priority: Priority;
  timeEstimate: number;
  dueDate: Date | null;
}

interface AiSuggestion {
  title: string;
  description: string;
  priority: Priority;
  timeEstimate: number;
  dueDate: Date | null;
}

export default function NewTaskPage() {
  const router = useRouter();
  const [userInput, setUserInput] = useState('');
  const [taskForm, setTaskForm] = useState<TaskForm>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    timeEstimate: 30,
    dueDate: null,
  });
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestion | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (userInput.trim().length > 5) {
        setIsLoadingAi(true);
        fetch('/api/suggest-task', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userInput }) })
          .then(res => res.json()).then(data => setAiSuggestion(data)).catch(console.error).finally(() => setIsLoadingAi(false));
      } else {
        setAiSuggestion(null);
      }
    }, 700);
    return () => clearTimeout(handler);
  }, [userInput]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAcceptSuggestion = () => {
    if (aiSuggestion) {
      setTaskForm({ ...aiSuggestion, dueDate: aiSuggestion.dueDate ? new Date(aiSuggestion.dueDate) : null });
      setAiSuggestion(null);
      setUserInput('');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    try {
      await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...taskForm, timeEstimate: Number(taskForm.timeEstimate) }) });
      router.push('/');
    } catch (error) { console.error(error); }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleAddTask}>
            <div className="mb-4">
              <label htmlFor="userInput" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                What do you need to do? (Type an idea to get AI suggestions)
              </label>
              <input
                id="userInput"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="e.g., plan the quarterly marketing campaign"
                className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:border-blue-500"
              />
            </div>

            {isLoadingAi && <p className="text-center text-gray-500">AI is thinking...</p>}
            {aiSuggestion && (
              <div className="border-2 border-blue-500 rounded-lg p-4 mb-4 bg-blue-50 dark:bg-gray-700">
                <h3 className="font-bold text-lg mb-2">✨ AI Suggestion</h3>
                <p><strong>Title:</strong> {aiSuggestion.title}</p>
                <p><strong>Description:</strong> {aiSuggestion.description}</p>
                <p><strong>Priority:</strong> {aiSuggestion.priority}</p>
                <p><strong>Time (mins):</strong> {aiSuggestion.timeEstimate}</p>
                <div className="mt-4 flex gap-4">
                  <button type="button" onClick={handleAcceptSuggestion} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Accept</button>
                  <button type="button" onClick={() => setAiSuggestion(null)} className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg">Clear</button>
                </div>
              </div>
            )}

            <hr className="my-6 border-gray-200 dark:border-gray-600"/>

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
            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Add Task</button>
          </form>
        </div>
      </div>
    </div>
  );
}