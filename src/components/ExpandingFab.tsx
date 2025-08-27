'use client';

import { useState } from 'react';

interface FabAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  bgColor: string;
}

interface ExpandingFabProps {
  actions: FabAction[];
}

export default function ExpandingFab({ actions }: ExpandingFabProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-3"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Action Buttons - rendered in reverse order for correct stacking */}
      <div className="flex flex-col items-center gap-3 transition-all duration-300 ease-in-out">
        {isExpanded &&
          [...actions].reverse().map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg transform transition-all duration-300 ease-in-out hover:scale-110 ${action.bgColor}`}
              aria-label={action.label}
            >
              {action.icon}
            </button>
          ))}
      </div>

      {/* Main FAB */}
      <button
        className="w-16 h-16 rounded-full bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-800 flex items-center justify-center shadow-xl transform transition-transform duration-200 hover:scale-110 focus:outline-none"
        aria-label="Toggle Actions"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-7 w-7 transition-transform duration-300 ${isExpanded ? 'rotate-45' : 'rotate-0'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
