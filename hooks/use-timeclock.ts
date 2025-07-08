import { useState, useEffect, useCallback } from 'react';
import type { TimeInputs } from '@/lib/types';
import { calculateElapsedTime, formatDuration, validateTimeInputs } from '@/lib/time-utils';

const STORAGE_KEY = 'timeclock-inputs';

export const useTimeclock = () => {
  const [inputs, setInputs] = useState<TimeInputs>({
    start: '',
    end: '',
    lunchStart: '',
    lunchEnd: '',
    extraMinutes: '',
  });

  const [elapsedTime, setElapsedTime] = useState<string>('00:00');
  const [lunchDuration, setLunchDuration] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showDecimal, setShowDecimal] = useState(false);
  const [elapsedDecimal, setElapsedDecimal] = useState<string>('0.000');
  const [lunchDecimal, setLunchDecimal] = useState<string>('0.000');

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInputs(parsed);
      } catch (error) {
        console.error('Failed to parse saved inputs:', error);
      }
    }
  }, []);

  const saveToStorage = useCallback((newInputs: TimeInputs) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newInputs));
    } catch (error) {
      console.error('Failed to save inputs:', error);
    }
  }, []);

  const calculateTime = useCallback((formInputs: TimeInputs) => {
    setError('');

    const validationError = validateTimeInputs(
      formInputs.start,
      formInputs.end,
      formInputs.lunchStart,
      formInputs.lunchEnd
    );

    if (validationError) {
      setError(validationError);
      setElapsedTime('00:00');
      setLunchDuration('');
      setElapsedDecimal('0.000');
      setLunchDecimal('0.000');
      return;
    }

    const { elapsed, lunch, decimal } = calculateElapsedTime(
      formInputs.start,
      formInputs.end,
      formInputs.lunchStart || undefined,
      formInputs.lunchEnd || undefined,
      formInputs.extraMinutes || undefined
    );

    setElapsedTime(elapsed);
    setElapsedDecimal(decimal.toFixed(3));
    setLunchDuration(
      formInputs.lunchStart && formInputs.lunchEnd ? formatDuration(lunch) : ''
    );
    setLunchDecimal(
      formInputs.lunchStart && formInputs.lunchEnd
        ? (lunch / (1000 * 60 * 60)).toFixed(3)
        : '0.000'
    );

    setInputs(formInputs);
    saveToStorage(formInputs);
  }, [saveToStorage]);

  const resetForm = useCallback(() => {
    const emptyInputs: TimeInputs = {
      start: '',
      end: '',
      lunchStart: '',
      lunchEnd: '',
      extraMinutes: '',
    };

    setInputs(emptyInputs);
    setElapsedTime('00:00');
    setLunchDuration('');
    setError('');
    setElapsedDecimal('0.000');
    setLunchDecimal('0.000');

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const toggleDecimalView = useCallback(() => {
    setShowDecimal((prev: boolean) => !prev);
  }, []);

  return {
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
  };
};