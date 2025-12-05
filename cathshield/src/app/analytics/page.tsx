'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Footer from '@/components/Footer';

interface WardAnalyticData {
  date: string;
  clabsiRate: number;
  clabsiCases: number;
  totalCentralLineDays: number;
  dressingChangeCount: number;
  catheterChangeCount: number;
}

interface ResourceDeprivationData {
  dressingDeprivationRate: number;
  catheterDeprivationRate: number;
  combinedDeprivedRate: number;
  deprivationBand: 'safe' | 'shortage' | 'major_shortage' | 'critical';
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [wardId] = useState('ward-icu-1');
  const [analyticsData, setAnalyticsData] = useState<WardAnalyticData[]>([]);
  const [deprivationData, setDeprivationData] = useState<ResourceDeprivationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [formData, setFormData] = useState({
    patientsNeedingToday: 5,
    availableDressings: 4,
    availableCatheters: 5,
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch ward analytics
      const analyticsRes = await fetch(`/api/ward-analytics?wardId=${wardId}&days=30`);
      const analyticsDataResult = await analyticsRes.json();
      if (analyticsDataResult.data) {
        setAnalyticsData(
          analyticsDataResult.data.map((item: any) => ({
            ...item,
            date: new Date(item.date).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
            }),
          }))
        );
      }

      // Fetch resource deprivation
      const deprivationRes = await fetch(`/api/resource-deprivation?wardId=${wardId}`);
      const deprivationDataResult = await deprivationRes.json();
      if (deprivationDataResult.data) {
        setDeprivationData(deprivationDataResult.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceDeprivationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/resource-deprivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wardId,
          ...formData,
        }),
      });
      if (res.ok) {
        setShowResourceForm(false);
        fetchAnalyticsData();
      }
    } catch (err) {
      console.error('Failed to submit resource deprivation:', err);
    }
  };

  const getDeprivationColor = (band: string) => {
    const colorMap: Record<string, string> = {
      safe: 'medical-green',
      shortage: 'medical-yellow',
      major_shortage: 'medical-orange',
      critical: 'medical-red',
    };
    return colorMap[band] || 'gray';
  };

  const getDeprivationLabel = (band: string) => {
    const labelMap: Record<string, string> = {
      safe: '🟢 Safe (<10%)',
      shortage: '🟡 Shortage (11-30%)',
      major_shortage: '🟠 Major Shortage (31-60%)',
      critical: '🔴 Critical (>60%)',
    };
    return labelMap[band] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-medical-blue">Loading Analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-medical-blue px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-medical-blue">CathShield.ai</h1>
          <p className="text-gray-600 mt-1">Ward-Level Analytics & Resource Deprivation</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* CLABSI Rate Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-medical-blue mb-6">CLABSI Rate Trend (Last 30 Days)</h2>
          
          {analyticsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analyticsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                <YAxis
                  label={{ value: 'CLABSI Rate per 1000 CVL days', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  formatter={(value) => `${parseFloat(value).toFixed(2)} per 1000`}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="clabsiRate"
                  stroke="#0066CC"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="CLABSI Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-base">No data available yet</p>
          )}

          {/* Statistics */}
          {analyticsData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">Latest CLABSI Rate</p>
                <p className="text-3xl font-bold text-medical-blue mt-1">
                  {analyticsData[0].clabsiRate.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">per 1000 CVL days</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">Total CVL Days</p>
                <p className="text-3xl font-bold text-medical-green mt-1">
                  {analyticsData.reduce((sum, d) => sum + d.totalCentralLineDays, 0)}
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">CLABSI Cases</p>
                <p className="text-3xl font-bold text-medical-orange mt-1">
                  {analyticsData.reduce((sum, d) => sum + d.clabsiCases, 0)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Resource Deprivation Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-medical-blue">Resource Deprivation Rate</h2>
            <button
              onClick={() => setShowResourceForm(!showResourceForm)}
              className="bg-medical-blue text-white px-4 py-2 rounded font-medium text-base hover:opacity-90"
            >
              {showResourceForm ? 'Cancel' : '📋 Update Resources'}
            </button>
          </div>

          {showResourceForm && (
            <form onSubmit={handleResourceDeprivationSubmit} className="mb-6 p-6 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Patients Needing Today
                  </label>
                  <input
                    type="number"
                    value={formData.patientsNeedingToday}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        patientsNeedingToday: parseInt(e.target.value),
                      }))
                    }
                    min="1"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Available Dressings
                  </label>
                  <input
                    type="number"
                    value={formData.availableDressings}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availableDressings: parseInt(e.target.value),
                      }))
                    }
                    min="0"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Available Catheters
                  </label>
                  <input
                    type="number"
                    value={formData.availableCatheters}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availableCatheters: parseInt(e.target.value),
                      }))
                    }
                    min="0"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded text-base"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-medical-blue text-white px-6 py-2 rounded font-medium text-base hover:opacity-90"
              >
                Submit
              </button>
            </form>
          )}

          {deprivationData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rates */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Deprivation Rates</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-700">Dressing Deprivation Rate:</span>
                    <span className="text-2xl font-bold text-medical-orange">
                      {deprivationData.dressingDeprivationRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-700">Catheter Deprivation Rate:</span>
                    <span className="text-2xl font-bold text-medical-orange">
                      {deprivationData.catheterDeprivationRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-800">Combined Rate:</span>
                    <span className="text-3xl font-bold text-medical-orange">
                      {deprivationData.combinedDeprivedRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col justify-center items-center p-6 rounded-lg bg-gradient-to-br from-gray-50 to-blue-50">
                <p className="text-base text-gray-700 mb-4">Current Status</p>
                <div
                  className={`text-5xl font-bold py-4 px-6 rounded-lg text-white ${
                    deprivationData.deprivationBand === 'safe'
                      ? 'bg-medical-green'
                      : deprivationData.deprivationBand === 'shortage'
                      ? 'bg-medical-yellow text-black'
                      : deprivationData.deprivationBand === 'major_shortage'
                      ? 'bg-medical-orange'
                      : 'bg-medical-red'
                  }`}
                >
                  {getDeprivationLabel(deprivationData.deprivationBand)}
                </div>
                {deprivationData.combinedDeprivedRate > 30 && (
                  <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-base font-semibold">
                    ⚠️ Supply Alert Triggered
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 bg-medical-blue text-white font-semibold py-3 rounded-lg text-lg hover:opacity-90"
          >
            ← Back to Patient Dashboard
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
