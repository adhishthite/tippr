"use client";

import { useState } from "react";

interface SplitToggleProps {
  enabled: boolean;
  count: number;
  onToggle: () => void;
  onCountChange: (count: number) => void;
}

export default function SplitToggle({
  enabled,
  count,
  onToggle,
  onCountChange,
}: SplitToggleProps) {
  const [inputValue, setInputValue] = useState<string>(count.toString());

  const handleInputChange = (value: string) => {
    // Only allow numeric characters
    const cleaned = value.replace(/[^\d]/g, "");
    setInputValue(cleaned);

    const num = parseInt(cleaned, 10);

    // Handle edge cases:
    // - Prevent zero (minimum 1)
    // - Cap at 50 people maximum
    if (!isNaN(num)) {
      const clamped = Math.max(1, Math.min(50, num));
      onCountChange(clamped);

      // Update input to show clamped value if exceeded
      if (num > 50) {
        setInputValue("50");
      } else if (num < 1) {
        setInputValue("1");
      }
    } else {
      // If empty or invalid, default to 1
      onCountChange(1);
    }
  };

  const increment = () => {
    const newCount = Math.min(50, count + 1);
    onCountChange(newCount);
    setInputValue(newCount.toString());
  };

  const decrement = () => {
    const newCount = Math.max(1, count - 1);
    onCountChange(newCount);
    setInputValue(newCount.toString());
  };

  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-sm uppercase tracking-wider text-neutral-600 hover:text-neutral-800 transition-colors"
      >
        <span>Split Bill</span>
        <span className="text-xs">{enabled ? "−" : "+"}</span>
      </button>

      {enabled && (
        <div className="pl-4 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={decrement}
              disabled={count <= 1}
              className="w-10 h-10 flex items-center justify-center border border-neutral-200 hover:border-neutral-400 disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"
            >
              −
            </button>

            <input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1 text-center text-2xl font-light py-2 border-b border-neutral-200 focus:border-neutral-800 focus:outline-none transition-colors"
            />

            <button
              onClick={increment}
              disabled={count >= 50}
              className="w-10 h-10 flex items-center justify-center border border-neutral-200 hover:border-neutral-400 disabled:opacity-30 disabled:hover:border-neutral-200 transition-colors"
            >
              +
            </button>
          </div>

          <p className="text-xs text-neutral-400 text-center">
            Divide total among {count} {count === 1 ? "person" : "people"}
          </p>

          {count >= 50 && (
            <p className="text-xs text-neutral-500 text-center">
              Maximum 50 people
            </p>
          )}
        </div>
      )}
    </div>
  );
}
