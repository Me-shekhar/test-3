'use client';

import React from 'react';
import { ClinicalAlert } from '@/types';

interface AlertCardProps {
  alert: ClinicalAlert;
  onAcknowledge: (alertId: string) => void;
}

export default function AlertCard({ alert, onAcknowledge }: AlertCardProps) {
  const severityColorMap = {
    green: 'border-medical-green bg-green-50',
    yellow: 'border-medical-yellow bg-yellow-50',
    orange: 'border-medical-orange bg-orange-50',
    red: 'border-medical-red bg-red-50',
  };

  const severityTextColorMap = {
    green: 'text-medical-green',
    yellow: 'text-gray-800',
    orange: 'text-orange-900',
    red: 'text-red-900',
  };

  const severityIconMap = {
    green: '🟢',
    yellow: '🟡',
    orange: '🟠',
    red: '🔴',
  };

  return (
    <div className={`border-l-4 ${severityColorMap[alert.severity]} rounded p-4 mb-3`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{severityIconMap[alert.severity]}</span>
            <h4 className={`text-lg font-semibold ${severityTextColorMap[alert.severity]}`}>
              {alert.reason}
            </h4>
          </div>
          <p className="text-base text-gray-700 mb-2">{alert.recommendedAction}</p>
          <p className="text-xs text-gray-500">
            {new Date(alert.timestamp).toLocaleString()}
          </p>
        </div>
        {!alert.acknowledged && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="ml-4 px-4 py-2 bg-medical-blue text-white rounded font-medium hover:opacity-90 whitespace-nowrap text-base"
          >
            Acknowledge
          </button>
        )}
        {alert.acknowledged && (
          <div className="ml-4 text-green-600 font-semibold">✓ Acknowledged</div>
        )}
      </div>
    </div>
  );
}
