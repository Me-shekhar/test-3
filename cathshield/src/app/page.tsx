'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivacyStatement from '@/components/PrivacyStatement';
import Footer from '@/components/Footer';
import { PatientFactors, SafetyChecklist } from '@/types';

export default function PatientIdentificationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bedNo: '',
    initials: '',
    insertionDate: new Date().toISOString().split('T')[0],
  });

  const [patientFactors, setPatientFactors] = useState<PatientFactors>({
    agitation: false,
    extremeAge: false,
    obesity: false,
    diabetes: false,
    ckd: false,
    cancer: false,
    dialysis: false,
    tpn: false,
    immunosuppression: false,
    malnutrition: false,
  });

  const [safetyChecklist, setSafetyChecklist] = useState<SafetyChecklist>({
    capsClosed: false,
    glovesWorn: false,
    noAbnormalities: false,
    dressingIntact: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePatientFactorChange = (factor: keyof PatientFactors) => {
    setPatientFactors((prev) => ({ ...prev, [factor]: !prev[factor] }));
  };

  const handleSafetyChecklistChange = (item: keyof SafetyChecklist) => {
    setSafetyChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.bedNo || !formData.initials) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          patientFactors,
          safetyChecklist,
        }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('currentPatientId', data.patientId);
        router.push('/consent');
      } else {
        setError(data.error || 'Failed to create patient');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-medical-blue px-4 py-6 text-center">
        <h1 className="text-4xl font-bold text-medical-blue mb-2">CathShield.ai</h1>
        <p className="text-gray-600 text-lg">Hospital-Grade Central Line Safety System</p>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <PrivacyStatement fullWidth />

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-medical-blue mb-6">Patient Identification</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Bed No. *
              </label>
              <input
                type="text"
                name="bedNo"
                value={formData.bedNo}
                onChange={handleInputChange}
                placeholder="e.g., ICU-105"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-medical-blue text-base"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Patient Initials *
              </label>
              <input
                type="text"
                name="initials"
                value={formData.initials}
                onChange={handleInputChange}
                placeholder="e.g., AB"
                maxLength={2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-medical-blue text-base"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Insertion Date *
              </label>
              <input
                type="date"
                name="insertionDate"
                value={formData.insertionDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-medical-blue text-base"
                required
              />
            </div>
          </div>

          {/* Patient Factors */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">⚠️</span> Patient Risk Factors
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'agitation', label: 'Agitation / Delirium' },
                  { key: 'extremeAge', label: 'Extremes of Age' },
                  { key: 'obesity', label: 'Obesity' },
                  { key: 'diabetes', label: 'Diabetes Mellitus (DM)' },
                  { key: 'ckd', label: 'Chronic Kidney Disease (CKD)' },
                  { key: 'cancer', label: 'Cancer (CA)' },
                  { key: 'dialysis', label: 'Dialysis' },
                  { key: 'tpn', label: 'TPN (Parenteral Nutrition)' },
                  { key: 'immunosuppression', label: 'Immunosuppression' },
                  { key: 'malnutrition', label: 'Malnutrition' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={patientFactors[key as keyof PatientFactors]}
                      onChange={() => handlePatientFactorChange(key as keyof PatientFactors)}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span className="ml-3 text-base text-gray-800">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Safety Checklist */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">✓</span> Nursing Safety Checklist
            </h3>
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-medical-blue">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'capsClosed', label: '✓ Caps Closed' },
                  { key: 'glovesWorn', label: '✓ Gloves Worn' },
                  { key: 'noAbnormalities', label: '✓ No Abnormalities' },
                  { key: 'dressingIntact', label: '✓ Dressing Intact' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={safetyChecklist[key as keyof SafetyChecklist]}
                      onChange={() => handleSafetyChecklistChange(key as keyof SafetyChecklist)}
                      className="w-5 h-5 rounded border-gray-300 text-medical-green"
                    />
                    <span className="ml-3 text-base text-gray-800">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-medical-blue text-white font-semibold py-3 rounded-lg text-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Creating Patient Record...' : 'Proceed to Consent →'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
