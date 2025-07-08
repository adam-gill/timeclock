import { Button } from '@/components/ui/button';

interface TimeDisplayProps {
  elapsedTime: string;
  elapsedDecimal: string;
  lunchDuration: string;
  lunchDecimal: string;
  showDecimal: boolean;
  onToggleDecimal: () => void;
}

export function TimeDisplay({
  elapsedTime,
  elapsedDecimal,
  lunchDuration,
  lunchDecimal,
  showDecimal,
  onToggleDecimal,
}: TimeDisplayProps) {
  return (
    <div className="flex flex-col gap-2 mt-8 bg-gray-900/70 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <p className="text-white text-lg font-semibold">Elapsed Time:</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleDecimal}
          className="ml-2 px-2 py-1 text-xs bg-blue-700 hover:bg-blue-800"
        >
          {showDecimal ? 'Show HH:MM' : 'Show Decimal'}
        </Button>
      </div>
      
      <p 
        className="text-blue-400 font-mono text-2xl text-center" 
        style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
      >
        {showDecimal ? `${elapsedDecimal} hours` : elapsedTime}
      </p>
      
      {lunchDuration && (
        <p className="text-white text-md text-center">
          Lunch Duration:{' '}
          <span 
            className="text-pink-400 font-mono"
            style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            {showDecimal ? `${lunchDecimal} hours` : lunchDuration}
          </span>
        </p>
      )}
    </div>
  );
}