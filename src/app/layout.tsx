import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ChatWindow } from '@/components/ChatWindow'; // Import ChatWindow

import ResponsiveNavbar from '@/components/ResponsiveNavbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskWise - AI Powered Task Manager",
  description: "An intelligent task manager powered by Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const taskItems = [
    { href: "/tasks/active", label: "Active Tasks" },
    { href: "/tasks/new", label: "Create New Task" },
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
            <ChatWindow />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}