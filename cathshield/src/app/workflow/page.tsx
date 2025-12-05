'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function ImageUploadWorkflowPage() {
  const router = useRouter();
  const [patientId, setPatientId] = useState('');
  const [cathetersiteFile, setCathetersiteFile] = useState<File | null>(null);
  const [tractionDeviceFile, setTractionDeviceFile] = useState<File | null>(null);
  const [yellowPulls, setYellowPulls] = useState('0');
  const [redPulls, setRedPulls] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('currentPatientId');
    if (!id) {
      router.push('/');
      return;
    }
    setPatientId(id);
  }, [router]);

  const handleCathetersiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCathetersiteFile(e.target.files[0]);
    }
  };

  const handleTractionDeviceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setTractionDeviceFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!cathetersiteFile) {
      setError('Catheter site image is required');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('patientId', patientId);
      formData.append('cathetersite', cathetersiteFile);
      if (tractionDeviceFile) {
        formData.append('tractionDevice', tractionDeviceFile);
      }
      formData.append('yellowPulls', yellowPulls);
      formData.append('redPulls', redPulls);

      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Images uploaded successfully! Navigating to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Failed to upload images');
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
      <div className="bg-white border-b-2 border-medical-blue px-4 py-6">
        <h1 className="text-3xl font-bold text-medical-blue text-center">CathShield.ai</h1>
        <p className="text-gray-600 text-center mt-1">12-Hourly Monitoring Workflow</p>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-medical-blue mb-6">
            Capture Patient Monitoring Data
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          {/* Catheter Site Image - Required */}
          <div className="mb-8 p-6 bg-red-50 border-2 border-medical-red rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              <span className="text-2xl mr-2">📷</span> Catheter Site Photo *
            </h3>
            <p className="text-base text-gray-700 mb-4">
              Capture a clear image of the catheter insertion site to assess integrity and detect any signs of infection or complications.
            </p>
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleCathetersiteChange}
                capture="environment"
                className="hidden"
                id="cathetersite-input"
                required
              />
              <label htmlFor="cathetersite-input" className="cursor-pointer">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-base font-medium text-gray-700">
                  {cathetersiteFile ? cathetersiteFile.name : 'Click to upload or use camera'}
                </p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG, or GIF</p>
              </label>
            </div>
          </div>

          {/* Traction Device Image - Optional */}
          <div className="mb-8 p-6 bg-blue-50 border-2 border-medical-blue rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              <span className="text-2xl mr-2">📷</span> Traction Device Photo (Optional)
            </h3>
            <p className="text-base text-gray-700 mb-4">
              If available, capture the traction device to assess tension and positioning.
            </p>
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleTractionDeviceChange}
                capture="environment"
                className="hidden"
                id="traction-input"
              />
              <label htmlFor="traction-input" className="cursor-pointer">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-base font-medium text-gray-700">
                  {tractionDeviceFile ? tractionDeviceFile.name : 'Click to upload or use camera'}
                </p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG, or GIF</p>
              </label>
            </div>
          </div>

          {/* Traction Pulls Count - Required if no traction photo */}
          {!tractionDeviceFile && (
            <div className="mb-8 p-6 bg-yellow-50 border-2 border-medical-yellow rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                <span className="text-2xl mr-2">⚠️</span> Traction Pulls (Last 12 Hours)
              </h3>
              <p className="text-base text-gray-700 mb-4">
                Since no traction device photo was uploaded, please record the number of pulls.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Yellow Pulls
                  </label>
                  <input
                    type="number"
                    value={yellowPulls}
                    onChange={(e) => setYellowPulls(e.target.value)}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-medical-yellow text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Red Pulls
                  </label>
                  <input
                    type="number"
                    value={redPulls}
                    onChange={(e) => setRedPulls(e.target.value)}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-medical-red text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/consent')}
              className="flex-1 bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg text-lg hover:opacity-90"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading || !cathetersiteFile}
              className="flex-1 bg-medical-blue text-white font-semibold py-3 rounded-lg text-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : '✓ Upload & View Dashboard →'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
