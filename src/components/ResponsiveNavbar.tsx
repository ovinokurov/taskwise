'use client';


import Link from 'next/link';
import RefForwardingLink from '@/components/RefForwardingLink';
import NavDropdown from "@/components/NavDropdown";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Disclosure } from '@headlessui/react';

interface ResponsiveNavbarProps {
  taskItems: { href: string; label: string }[];
}

export default function ResponsiveNavbar({ taskItems }: ResponsiveNavbarProps) {
  return (
    <Disclosure className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      {({ open }) => (
        <div>
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              <Link href="/">TaskWise</Link>
            </h1>
            <div className="flex items-center gap-4 md:hidden"> {/* Mobile menu button */}
              <ThemeSwitcher />
              <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </Disclosure.Button>
            </div>
            <div className="hidden md:flex items-center gap-4"> {/* Desktop navigation */}
              <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:underline">Calendar</Link>
              <Link href="/reporting" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:underline">Reports</Link>
              <NavDropdown title="Tasks" items={taskItems} />
              <ThemeSwitcher />
            </div>
          </div>

          <Disclosure.Panel className="md:hidden"> {/* Mobile menu panel */}
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Disclosure.Button as={RefForwardingLink} href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-gray-100 dark:hover:bg-gray-700">
                Calendar
              </Disclosure.Button>
              <Disclosure.Button as={RefForwardingLink} href="/reporting" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-gray-100 dark:hover:bg-gray-700">
                Reports
              </Disclosure.Button>
              {/* For NavDropdown, we might need to create a separate mobile-friendly version or just list its items */}
              {taskItems.map((item) => (
                <Disclosure.Button
                  key={item.href}
                  as={RefForwardingLink}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-gray-100 dark:hover:bg-gray-700"
                >
                  {item.label}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
