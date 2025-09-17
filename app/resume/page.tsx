"use client";

import { useEffect } from 'react';

export default function ResumePage() {
  useEffect(() => {
    // Direct redirect to PDF
    window.location.href = '/cv.pdf';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/70 text-sm">Opening resume...</p>
      </div>
    </div>
  );
}