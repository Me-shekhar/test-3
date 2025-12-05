'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendData } from '@/types';

interface TrendPlotProps {
  data: TrendData[];
}

export default function TrendPlot({ data }: TrendPlotProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <p className="text-gray-600 text-base">No trend data available yet. Begin 12-hourly monitoring.</p>
      </div>
    );
  }

  const chartData = data.map((point) => ({
    ...point,
    timestamp: new Date(point.timestamp).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
    riskScore: point.clisaScore,
    predictiveScore: point.predictiveClabsiScore,
    eventMarker: getEventMarkerValue(point.eventType),
  }));

  const getColor = (band: 'green' | 'yellow' | 'red') => {
    const colorMap = {
      green: '#00AA66',
      yellow: '#FFB81C',
      red: '#DD0000',
    };
    return colorMap[band];
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 my-6">
      <h3 className="text-2xl font-semibold text-medical-blue mb-4">12-Hourly Risk Trend</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CLISA Trend */}
        <div>
          <h4 className="text-lg font-medium text-gray-800 mb-3">CLISA Score Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" angle={-45} textAnchor="end" height={80} interval={Math.floor(data.length / 3)} />
              <YAxis domain={[0, 10]} />
              <Tooltip formatter={(value) => value.toFixed(1)} />
              <Line
                type="monotone"
                dataKey="riskScore"
                stroke="#0066CC"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Venous Resistance Risk */}
        <div>
          <h4 className="text-lg font-medium text-gray-800 mb-3">Venous Resistance Risk Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="predictiveScore" name="Score" />
              <YAxis type="number" dataKey="eventMarker" name="Risk Level" domain={[0, 3]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              {data.map((point, index) => (
                <Scatter
                  key={index}
                  name={`VR ${point.predictiveVenousResistanceBand}`}
                  data={[
                    {
                      predictiveScore: point.predictiveClabsiScore,
                      eventMarker: getEventMarkerValue(point.eventType),
                    },
                  ]}
                  fill={getColor(point.predictiveVenousResistanceBand)}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Event Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Event Markers:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚪</span>
            <span className="text-sm">Dressing Changed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚫</span>
            <span className="text-sm">Catheter Changed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🟣</span>
            <span className="text-sm">Flushing Event</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">—</span>
            <span className="text-sm">No Event</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getEventMarkerValue(eventType?: string): number {
  const eventMap: Record<string, number> = {
    dressing_change: 1,
    catheter_change: 2,
    flushing: 3,
  };
  return eventType ? eventMap[eventType] : 0;
}
