'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AudioConsent from '@/components/AudioConsent';
import Footer from '@/components/Footer';

export default function ConsentPage() {
  const router = useRouter();
  const [patientId, setPatientId] = useState('');
  const [audioLanguage, setAudioLanguage] = useState('English');
  const [audioPlaybackComplete, setAudioPlaybackComplete] = useState(false);
  const [consentObtained, setConsentObtained] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('currentPatientId');
    if (!id) {
      router.push('/');
      return;
    }
    setPatientId(id);
  }, [router]);

  const handlePlaybackComplete = () => {
    setAudioPlaybackComplete(true);
  };

  const handleLanguageChange = (language: string) => {
    setAudioLanguage(language);
  };

  const handleConsentCheckbox = () => {
    if (audioPlaybackComplete) {
      setConsentObtained(!consentObtained);
    }
  };

  const handleSubmit = async () => {
    if (!audioPlaybackComplete || !consentObtained) {
      setError('Please complete audio playback and confirm consent');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          audioLanguageUsed: audioLanguage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push('/workflow');
      } else {
        setError(data.error || 'Failed to record consent');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!patientId) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-medical-blue px-4 py-6 text-center">
        <h1 className="text-3xl font-bold text-medical-blue">CathShield.ai</h1>
        <p className="text-gray-600 mt-1">Patient Consent Module</p>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-medical-blue mb-6">Audio Consent Verification</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <AudioConsent
            onPlaybackComplete={handlePlaybackComplete}
            onLanguageChange={handleLanguageChange}
          />

          {/* Consent Confirmation */}
          <div className="mt-6 mb-6">
            <div
              className={`p-4 rounded-lg border-2 transition ${
                audioPlaybackComplete
                  ? 'bg-green-50 border-medical-green'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentObtained}
                  onChange={handleConsentCheckbox}
                  disabled={!audioPlaybackComplete}
                  className={`w-6 h-6 rounded border-2 ${
                    audioPlaybackComplete ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                />
                <span className="ml-3 text-base font-medium text-gray-800">
                  I have explained and obtained patient/guardian consent
                </span>
              </label>
            </div>
            {!audioPlaybackComplete && (
              <p className="text-sm text-gray-600 mt-2 italic">
                ⏸️ Listen to the complete audio before you can confirm consent.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg text-lg hover:opacity-90"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!audioPlaybackComplete || !consentObtained || loading}
              className="flex-1 bg-medical-blue text-white font-semibold py-3 rounded-lg text-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Recording Consent...' : 'Proceed to Workflow →'}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
