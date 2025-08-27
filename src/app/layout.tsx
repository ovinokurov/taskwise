'use client';

import { useState } from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ChatWindow } from '@/components/ChatWindow';
import TaskCreationModal from '@/components/TaskCreationModal';
import ResponsiveNavbar from '@/components/ResponsiveNavbar';
import { useRouter } from 'next/navigation';
import ExpandingFab from '@/components/ExpandingFab';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  const taskItems = [
    { href: "/tasks/active", label: "Active Tasks" },
    { href: "/tasks/new", label: "Create New Task" },
  ];

  const handleTaskCreated = () => {
    router.push('/tasks/active');
  };

  const fabActions = [
    {
      label: "Create Task",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
      onClick: () => setIsTaskModalOpen(true),
      bgColor: 'bg-green-600 hover:bg-green-700',
    },
    {
      label: "Open Chat",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      onClick: () => setIsChatOpen(true),
      bgColor: 'bg-blue-600 hover:bg-blue-700',
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
            <ResponsiveNavbar taskItems={taskItems} />
            <main>{children}</main>
            <ChatWindow isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
            <ExpandingFab actions={fabActions} />

            {isTaskModalOpen && (
              <TaskCreationModal
                onClose={() => setIsTaskModalOpen(false)}
                onTaskCreated={() => {
                  setIsTaskModalOpen(false);
                  handleTaskCreated();
                }}
              />
            )}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
