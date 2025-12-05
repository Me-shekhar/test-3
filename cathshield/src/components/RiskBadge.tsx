'use client';

import React from 'react';

interface RiskBadgeProps {
  level: 'green' | 'yellow' | 'orange' | 'red';
  label: string;
  score?: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function RiskBadge({ level, label, score, maxScore, size = 'md' }: RiskBadgeProps) {
  const colorMap = {
    green: 'bg-medical-green text-white',
    yellow: 'bg-medical-yellow text-black',
    orange: 'bg-medical-orange text-white',
    red: 'bg-medical-red text-white',
  };

  const sizeMap = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const riskLabel = {
    green: '🟢',
    yellow: '🟡',
    orange: '🟠',
    red: '🔴',
  };

  return (
    <div className={`${colorMap[level]} ${sizeMap[size]} rounded-lg font-semibold inline-block`}>
      <span className="mr-2">{riskLabel[level]}</span>
      {label}
      {score !== undefined && maxScore !== undefined && (
        <span className="ml-2 opacity-90">({score}/{maxScore})</span>
      )}
    </div>
  );
}
