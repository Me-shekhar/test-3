'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RiskBadge from '@/components/RiskBadge';
import AlertCard from '@/components/AlertCard';
import TrendPlot from '@/components/TrendPlot';
import Footer from '@/components/Footer';
import { RiskScore, ClinicalAlert, TrendData } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [patientId, setPatientId] = useState('');
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [alerts, setAlerts] = useState<ClinicalAlert[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [bedNo, setBedNo] = useState('');
  const [initials, setInitials] = useState('');
  const [daysOnCatheter, setDaysOnCatheter] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('currentPatientId');
    if (!id) {
      router.push('/');
      return;
    }
    setPatientId(id);
    fetchDashboardData(id);
  }, [router]);

  const fetchDashboardData = async (patientId: string) => {
    setLoading(true);
    try {
      // Fetch patient info
      const patientRes = await fetch(`/api/patients?patientId=${patientId}`);
      const patientData = await patientRes.json();
      if (patientData.data) {
        setBedNo(patientData.data.bed_no);
        setInitials(patientData.data.initials);
        
        // Calculate days on catheter
        const insertionDate = new Date(patientData.data.insertion_date);
        const today = new Date();
        const days = Math.floor((today.getTime() - insertionDate.getTime()) / (1000 * 60 * 60 * 24));
        setDaysOnCatheter(days);
      }

      // Fetch latest risk score
      const riskRes = await fetch(`/api/risk-score?patientId=${patientId}`);
      const riskData = await riskRes.json();
      if (riskData.data) {
        setRiskScore(riskData.data);
      }

      // Fetch alerts
      const alertsRes = await fetch(`/api/alerts?patientId=${patientId}`);
      const alertsData = await alertsRes.json();
      if (alertsData.data) {
        setAlerts(alertsData.data);
      }

      // Fetch events for trend
      const eventsRes = await fetch(`/api/events?patientId=${patientId}`);
      const eventsData = await eventsRes.json();
      if (eventsData.data) {
        // Mock trend data - in production, construct from actual events
        const mockTrend: TrendData[] = [
          {
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
            clisaScore: 2,
            predictiveClabsiScore: 2,
            predictiveVenousResistanceBand: 'green',
          },
          {
            timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
            clisaScore: 3,
            predictiveClabsiScore: 3,
            predictiveVenousResistanceBand: 'green',
            eventType: 'dressing_change',
          },
          {
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            clisaScore: 2,
            predictiveClabsiScore: 2,
            predictiveVenousResistanceBand: 'green',
          },
          {
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
            clisaScore: 4,
            predictiveClabsiScore: 4,
            predictiveVenousResistanceBand: 'yellow',
          },
          {
            timestamp: new Date(),
            clisaScore: riskScore?.clisaScore || 3,
            predictiveClabsiScore: riskScore?.predictiveClabsiScore || 3,
            predictiveVenousResistanceBand: riskScore?.predictiveVenousResistanceBand || 'green',
          },
        ];
        setTrendData(mockTrend);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId }),
      });
      if (res.ok) {
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.id === alertId ? { ...alert, acknowledged: true } : alert
          )
        );
      }
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const handleLogEvent = async (eventType: string) => {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, eventType }),
      });
      // Refresh dashboard
      fetchDashboardData(patientId);
    } catch (err) {
      console.error('Failed to log event:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-medical-blue">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-medical-blue px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-medical-blue">CathShield.ai</h1>
          <p className="text-gray-600 mt-1">
            Bed {bedNo} | Patient {initials} | Day {daysOnCatheter + 1}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Risk Summary Cards */}
        {riskScore && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* CLISA Score */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">CLISA Score</h3>
              <div className="text-5xl font-bold text-medical-blue mb-2">
                {riskScore.clisaScore}
              </div>
              <p className="text-gray-600">out of 7 points</p>
            </div>

            {/* Predictive CLABSI Risk */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Predictive CLABSI Risk</h3>
              <div className="mb-3">
                <RiskBadge
                  level={riskScore.predictiveClabsiBand}
                  label={riskScore.predictiveClabsiBand.toUpperCase()}
                  score={riskScore.predictiveClabsiScore}
                  maxScore={10}
                  size="lg"
                />
              </div>
              <p className="text-sm text-gray-600">
                Score: {riskScore.predictiveClabsiScore}/10
              </p>
            </div>

            {/* Venous Resistance Risk */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Venous Resistance Risk</h3>
              <div className="mb-3">
                <RiskBadge
                  level={riskScore.predictiveVenousResistanceBand}
                  label={riskScore.predictiveVenousResistanceBand.toUpperCase()}
                  size="lg"
                />
              </div>
              <p className="text-sm text-gray-600">Based on traction & dwell time</p>
            </div>
          </div>
        )}

        {/* Recommended Action */}
        {riskScore && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-medical-blue">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              💡 Highlighted Nurse Action
            </h3>
            <div
              className={`text-xl font-bold py-3 px-4 rounded-lg ${
                riskScore.actionColor === 'green'
                  ? 'bg-green-100 text-medical-green'
                  : riskScore.actionColor === 'yellow'
                  ? 'bg-yellow-100 text-gray-800'
                  : riskScore.actionColor === 'orange'
                  ? 'bg-orange-100 text-orange-900'
                  : 'bg-red-100 text-medical-red'
              }`}
            >
              {riskScore.recommendedAction}
            </div>
          </div>
        )}

        {/* Clinical Alerts */}
        {alerts.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">⚠️ Clinical Alerts</h3>
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={handleAcknowledgeAlert}
              />
            ))}
          </div>
        )}

        {/* Event Logging Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Log Clinical Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleLogEvent('dressing_change')}
              className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-3 rounded-lg text-base"
            >
              ⚪ Dressing Changed
            </button>
            <button
              onClick={() => handleLogEvent('catheter_change')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg text-base"
            >
              ⚫ Catheter Changed
            </button>
            <button
              onClick={() => handleLogEvent('flushing')}
              className="bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold py-3 rounded-lg text-base"
            >
              🟣 Flushing Event
            </button>
          </div>
        </div>

        {/* Trend Plot */}
        <TrendPlot data={trendData} />

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => router.push('/workflow')}
            className="bg-medical-blue text-white font-semibold py-3 rounded-lg text-lg hover:opacity-90"
          >
            📷 Next 12-Hourly Capture
          </button>
          <button
            onClick={() => router.push('/analytics')}
            className="bg-medical-teal text-white font-semibold py-3 rounded-lg text-lg hover:opacity-90"
          >
            📊 Ward Analytics
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
