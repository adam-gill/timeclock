import type { TimeCalculation } from './types';

export const calculateElapsedTime = (
  start: string,
  end: string,
  lunchStart?: string,
  lunchEnd?: string,
  extraMinutes?: string
): TimeCalculation => {
  const startDate = new Date(`1970-01-01T${start}`);
  const endDate = new Date(`1970-01-01T${end}`);
  
  let elapsed = endDate.getTime() - startDate.getTime();
  let lunch = 0;

  if (lunchStart && lunchEnd) {
    const lunchStartDate = new Date(`1970-01-01T${lunchStart}`);
    const lunchEndDate = new Date(`1970-01-01T${lunchEnd}`);
    lunch = lunchEndDate.getTime() - lunchStartDate.getTime();
    elapsed -= lunch;
  }

  if (extraMinutes && !isNaN(Number(extraMinutes))) {
    const extra = Number(extraMinutes) * 60 * 1000;
    elapsed += extra;
  }

  const hours = Math.floor(elapsed / (1000 * 60 * 60));
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
  const decimal = elapsed / (1000 * 60 * 60);

  return {
    elapsed: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
    lunch,
    decimal,
  };
};

export const formatDuration = (ms: number): string => {
  if (ms <= 0) return "00:00";
  
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const validateTimeInputs = (
  start: string,
  end: string,
  lunchStart?: string,
  lunchEnd?: string
): string | null => {
  if (!start || !end) {
    return "Start and end time are required.";
  }

  if ((lunchStart && !lunchEnd) || (!lunchStart && lunchEnd)) {
    return "If you enter a lunch start or end, you must enter both.";
  }

  return null;
};