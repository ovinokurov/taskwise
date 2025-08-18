'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavDropdownProps {
  title: string;
  items: { href: string; label: string }[];
}

export default function NavDropdown({ title, items }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:underline flex items-center">
        {title}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20">
          <div className="py-1">
            {items.map(item => (
              <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
