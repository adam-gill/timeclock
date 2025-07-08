export interface TimeInputs {
  start: string;
  end: string;
  lunchStart: string;
  lunchEnd: string;
  extraMinutes: string;
}

export interface TimeCalculation {
  elapsed: string;
  lunch: number;
  decimal: number;
}

export interface FormData {
  startTime: string;
  endTime: string;
  lunchStart?: string;
  lunchEnd?: string;
  extraMinutes?: string;
}