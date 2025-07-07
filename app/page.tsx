"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");
  const [lunchDuration, setLunchDuration] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [inputs, setInputs] = useState({
    start: "",
    end: "",
    lunchStart: "",
    lunchEnd: "",
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const [showDecimal, setShowDecimal] = useState(false);
  const [elapsedDecimal, setElapsedDecimal] = useState<string>("0.000");

  useEffect(() => {
    // On mount, load from localStorage
    const saved = localStorage.getItem("timeclock-inputs");
    if (saved) {
      const parsed = JSON.parse(saved);
      setInputs(parsed);
      setTimeout(() => {
        if (formRef.current) {
          if (parsed.start) formRef.current["start-time"].value = parsed.start;
          if (parsed.end) formRef.current["end-time"].value = parsed.end;
          if (parsed.lunchStart) formRef.current["lunch-start"].value = parsed.lunchStart;
          if (parsed.lunchEnd) formRef.current["lunch-end"].value = parsed.lunchEnd;
        }
      }, 0);
    }
  }, []);

  const calculateElapsedTime = (start: string, end: string, lunchStart?: string, lunchEnd?: string) => {
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
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const decimal = (elapsed / (1000 * 60 * 60));
    return { elapsed: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`, lunch, decimal };
  };

  const formatDuration = (ms: number) => {
    if (ms <= 0) return "00:00";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.target as HTMLFormElement;
    const startInput = form.elements.namedItem("start-time") as HTMLInputElement | null;
    const endInput = form.elements.namedItem("end-time") as HTMLInputElement | null;
    const lunchStartInput = form.elements.namedItem("lunch-start") as HTMLInputElement | null;
    const lunchEndInput = form.elements.namedItem("lunch-end") as HTMLInputElement | null;
    const start = startInput?.value || "";
    const end = endInput?.value || "";
    const lunchStart = lunchStartInput?.value || "";
    const lunchEnd = lunchEndInput?.value || "";
    if (!start || !end) {
      setError("Start and end time are required.");
      setElapsedTime("00:00");
      setLunchDuration("");
      setElapsedDecimal("0.000");
      return;
    }
    // If either lunchStart or lunchEnd is filled, require both
    if ((lunchStart && !lunchEnd) || (!lunchStart && lunchEnd)) {
      setError("If you enter a lunch start or end, you must enter both.");
      setElapsedTime("00:00");
      setLunchDuration("");
      setElapsedDecimal("0.000");
      return;
    }
    const { elapsed, lunch, decimal } = calculateElapsedTime(start, end, lunchStart && lunchEnd ? lunchStart : undefined, lunchStart && lunchEnd ? lunchEnd : undefined);
    setElapsedTime(elapsed);
    setElapsedDecimal(decimal.toFixed(3));
    setLunchDuration(lunchStart && lunchEnd ? formatDuration(lunch) : "");
    // Save to localStorage
    const toSave = { start, end, lunchStart, lunchEnd };
    setInputs(toSave);
    localStorage.setItem("timeclock-inputs", JSON.stringify(toSave));
  };

  const handleReset = () => {
    setInputs({ start: "", end: "", lunchStart: "", lunchEnd: "" });
    setElapsedTime("00:00");
    setLunchDuration("");
    setError("");
    localStorage.removeItem("timeclock-inputs");
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 px-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-extrabold text-white mb-6 text-center tracking-tight">⏰ Timeclock</h1>
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="start-time" className="text-white font-medium">Start Time</label>
            <input type="time" id="start-time" name="start-time" required defaultValue={inputs.start} className="rounded-lg px-3 py-2 bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-2 bg-gray-800/60 p-4 rounded-xl border border-gray-700">
            <div className="flex flex-col gap-2">
              <label htmlFor="lunch-start" className="text-white font-medium">Lunch Start <span className="text-gray-400 text-xs">(optional)</span></label>
              <input type="time" id="lunch-start" name="lunch-start" defaultValue={inputs.lunchStart} className="rounded-lg px-3 py-2 bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lunch-end" className="text-white font-medium">Lunch End <span className="text-gray-400 text-xs">(optional)</span></label>
              <input type="time" id="lunch-end" name="lunch-end" defaultValue={inputs.lunchEnd} className="rounded-lg px-3 py-2 bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="end-time" className="text-white font-medium">End Time</label>
            <input type="time" id="end-time" name="end-time" required defaultValue={inputs.end} className="rounded-lg px-3 py-2 bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {error && <div className="text-red-400 text-sm font-semibold text-center">{error}</div>}
          <div className="flex flex-col gap-1">
            <button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-150">Calculate</button>
            <button type="button" onClick={handleReset} className="w-1/3 mx-auto text-white font-semibold py-1 px-3 rounded transition-all duration-150 text-sm">Reset</button>
          </div>
        </form>
        <div className="flex flex-col gap-2 mt-8 bg-gray-900/70 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white text-lg font-semibold">Elapsed Time:</p>
            <button
              type="button"
              onClick={() => setShowDecimal((v) => !v)}
              className="ml-2 px-2 py-1 text-xs rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold transition-all duration-150"
            >
              {showDecimal ? "Show HH:MM" : "Show Decimal"}
            </button>
          </div>
          <p className="text-blue-400 font-mono text-2xl text-center" id="elapsed-time">
            {showDecimal ? `${elapsedDecimal} hours` : elapsedTime}
          </p>
          {lunchDuration && (
            <p className="text-white text-md text-center">Lunch Duration: <span className="text-pink-400 font-mono">{lunchDuration}</span></p>
          )}
        </div>
        <div className="mt-6 text-center text-gray-400 text-xs">YC Ready • Built with Next.js & Tailwind CSS</div>
      </div>
    </div>
  );
}
