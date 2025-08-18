import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ChatWindow } from '@/components/ChatWindow'; // Import ChatWindow
import Link from "next/link";
import NavDropdown from "@/components/NavDropdown";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

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
            <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                  <Link href="/">TaskWise</Link>
                </h1>
                <div className="flex items-center gap-4">
                  <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:underline">Calendar</Link>
                  <Link href="/reporting" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:underline">Reports</Link>
                  <NavDropdown title="Tasks" items={taskItems} />
                  <ThemeSwitcher />
                </div>
              </div>
            </header>
            <main>{children}</main>
            <ChatWindow />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
