'use client';

import React from 'react';

interface PrivacyStatementProps {
  fullWidth?: boolean;
}

export default function PrivacyStatement({ fullWidth = false }: PrivacyStatementProps) {
  return (
    <div className={`${fullWidth ? 'w-full' : 'max-w-2xl mx-auto'} bg-blue-50 border-l-4 border-medical-blue p-4 rounded my-4`}>
      <div className="flex items-start">
        <svg
          className="w-6 h-6 text-medical-blue mt-1 mr-3 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1H7v2h2V4zm2 2H9v2h2V6zm2-2h-2v2h2V4zm2 2h-2v2h2V6z" clipRule="evenodd" />
        </svg>
        <div>
          <h3 className="text-lg font-semibold text-medical-blue mb-1">Privacy & Confidentiality</h3>
          <p className="text-base text-gray-800 leading-relaxed">
            Patient privacy and information will be kept intact and used solely for patient care and safety.
          </p>
        </div>
      </div>
    </div>
  );
}
