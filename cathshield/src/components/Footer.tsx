'use client';

import React from 'react';

interface FooterProps {
  variant?: 'minimal' | 'full';
}

export default function Footer({ variant = 'minimal' }: FooterProps) {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 py-6 px-4 mt-8">
      <div className="max-w-6xl mx-auto text-center text-sm text-gray-700">
        <p className="leading-relaxed">
          The safety indexes in this system are content-validated by existing research and clinicians 
          (SCVI ≥ .82, Cronbach's α = .82) and continue to be externally validated.
        </p>
        {variant === 'full' && (
          <p className="mt-3 text-xs text-gray-500">
            CathShield.ai | Hospital-Grade Medical Safety System
          </p>
        )}
      </div>
    </footer>
  );
}
