'use client';

import { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { TimeInputs } from '@/lib/types';

interface TimeFormProps {
  inputs: TimeInputs;
  error: string;
  onSubmit: (inputs: TimeInputs) => void;
  onReset: () => void;
}

export function TimeForm({ inputs, error, onSubmit, onReset }: TimeFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  // Sync form values with inputs state when inputs change
  useEffect(() => {
    if (!formRef.current) return;

    const form = formRef.current;
    const elements = form.elements;

    (elements.namedItem('start-time') as HTMLInputElement).value = inputs.start;
    (elements.namedItem('end-time') as HTMLInputElement).value = inputs.end;
    (elements.namedItem('lunch-start') as HTMLInputElement).value = inputs.lunchStart;
    (elements.namedItem('lunch-end') as HTMLInputElement).value = inputs.lunchEnd;
    (elements.namedItem('extra-minutes') as HTMLInputElement).value = inputs.extraMinutes;
  }, [inputs]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newInputs: TimeInputs = {
      start: formData.get('start-time') as string,
      end: formData.get('end-time') as string,
      lunchStart: formData.get('lunch-start') as string,
      lunchEnd: formData.get('lunch-end') as string,
      extraMinutes: formData.get('extra-minutes') as string,
    };

    onSubmit(newInputs);
  };

  const handleReset = () => {
    formRef.current?.reset();
    onReset();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        type="time"
        name="start-time"
        label="Start Time"
        defaultValue={inputs.start}
        required
      />

      <div className="bg-gray-800/60 p-4 rounded-xl border border-gray-700">
        <Input
          type="time"
          name="lunch-start"
          label="Lunch Start"
          helperText="optional"
          defaultValue={inputs.lunchStart}
          className="bg-gray-900 mb-4"
        />
        <Input
          type="time"
          name="lunch-end"
          label="Lunch End"
          helperText="optional"
          defaultValue={inputs.lunchEnd}
          className="bg-gray-900"
        />
      </div>

      <Input
        type="time"
        name="end-time"
        label="End Time"
        defaultValue={inputs.end}
        required
      />

      <Input
        type="number"
        name="extra-minutes"
        label="Extra Time (minutes)"
        helperText="optional"
        min="0"
        step="1"
        defaultValue={inputs.extraMinutes}
        placeholder="0"
      />

      {error && (
        <div className="text-red-400 text-sm font-semibold text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <Button type="submit" className="w-full mt-2">
          Calculate
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleReset}
          className="w-1/3 mx-auto"
        >
          Reset
        </Button>
      </div>
    </form>
  );
}