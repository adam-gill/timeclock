'use client';

import { useTimeclock } from '@/hooks/use-timeclock';
import { TimeForm } from '@/components/timeclock/time-form';
import { TimeDisplay } from '@/components/timeclock/time-display';

export default function Home() {
  const {
    inputs,
    elapsedTime,
    lunchDuration,
    error,
    showDecimal,
    elapsedDecimal,
    lunchDecimal,
    calculateTime,
    resetForm,
    toggleDecimalView,
  } = useTimeclock();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700 py-5">
        <h1 className="text-3xl font-extrabold text-white mb-6 text-center tracking-tight">
          ⏰ Timeclock
        </h1>
        
        <TimeForm
          inputs={inputs}
          error={error}
          onSubmit={calculateTime}
          onReset={resetForm}
        />
        
        <TimeDisplay
          elapsedTime={elapsedTime}
          elapsedDecimal={elapsedDecimal}
          lunchDuration={lunchDuration}
          lunchDecimal={lunchDecimal}
          showDecimal={showDecimal}
          onToggleDecimal={toggleDecimalView}
        />
        
        <div className="mt-6 text-center text-gray-400 text-xs">
          YC Ready • Built with Next.js & Tailwind CSS
        </div>
      </div>
    </div>
  );
}
