'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AudioConsentProps {
  onPlaybackComplete: () => void;
  onLanguageChange: (language: string) => void;
}

export default function AudioConsent({ onPlaybackComplete, onLanguageChange }: AudioConsentProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [language, setLanguage] = useState('English');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const audioUrls: Record<string, string> = {
    English: '/audio/consent-english.mp3',
    Hindi: '/audio/consent-hindi.mp3',
    Tamil: '/audio/consent-tamil.mp3',
    Telugu: '/audio/consent-telugu.mp3',
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    onLanguageChange(newLanguage);
    setHasFinished(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.src = audioUrls[newLanguage];
      audioRef.current.currentTime = 0;
    }
  };

  const handlePlaybackEnded = () => {
    setIsPlaying(false);
    setHasFinished(true);
    onPlaybackComplete();
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('ended', handlePlaybackEnded);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('ended', handlePlaybackEnded);
      audio.removeEventListener('play', handlePlay);
    };
  }, []);

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 my-4">
      <h3 className="text-xl font-semibold text-medical-blue mb-4">Patient/Guardian Consent Audio</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Language:</label>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(audioUrls).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-4 py-2 rounded font-medium text-base transition ${
                language === lang
                  ? 'bg-medical-blue text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {lang === 'English' ? `${lang} (Mandatory)` : `Play ${lang}`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <audio
          ref={audioRef}
          src={audioUrls[language]}
          controls
          controlsList="nodownload"
          className="w-full h-12"
          onContextMenu={(e) => e.preventDefault()}
        >
          Your browser does not support the audio element.
        </audio>
        <p className="text-xs text-gray-600 mt-2 italic">
          {isPlaying ? '🔊 Playing...' : hasFinished ? '✓ Playback complete' : 'Click play to start'}
        </p>
      </div>

      {hasFinished && (
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              disabled
              checked={true}
              className="w-5 h-5 text-medical-green rounded cursor-not-allowed"
            />
            <span className="ml-3 text-base text-gray-800 font-medium">
              I have explained and obtained patient/guardian consent
            </span>
          </label>
        </div>
      )}

      {!hasFinished && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-base text-gray-800">
            ⏸️ Please listen to the complete audio consent before proceeding.
          </p>
        </div>
      )}
    </div>
  );
}
