"use client";

import { useState } from "react";
import { validateTipPercent } from "@/lib/calculations";

interface TipSelectorProps {
  selectedPercent: number;
  onPercentChange: (percent: number) => void;
}

const PRESET_PERCENTAGES = [15, 18, 20, 25];

export default function TipSelector({
  selectedPercent,
  onPercentChange,
}: TipSelectorProps) {
  const [customInput, setCustomInput] = useState<string>("");
  const [showCustom, setShowCustom] = useState<boolean>(false);

  const isPresetSelected = PRESET_PERCENTAGES.includes(selectedPercent);

  const handlePresetClick = (percent: number) => {
    onPercentChange(percent);
    setShowCustom(false);
    setCustomInput("");
  };

  const handleCustomClick = () => {
    setShowCustom(true);
  };

  const handleCustomChange = (value: string) => {
    // Block non-numeric characters during typing
    const cleaned = value.replace(/[^\d.]/g, "");
    setCustomInput(cleaned);

    const validation = validateTipPercent(cleaned);
    if (validation.isValid && validation.sanitized > 0) {
      onPercentChange(validation.sanitized);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm uppercase tracking-wider text-neutral-600">
        Tip Percentage
      </label>

      <div className="grid grid-cols-5 gap-3">
        {PRESET_PERCENTAGES.map((percent) => (
          <button
            key={percent}
            onClick={() => handlePresetClick(percent)}
            className={`
              py-4 px-6 text-lg font-light border-2 transition-all
              ${
                selectedPercent === percent && !showCustom
                  ? "border-neutral-800 bg-neutral-800 text-white"
                  : "border-neutral-200 hover:border-neutral-400 text-neutral-800"
              }
            `}
          >
            {percent}%
          </button>
        ))}

        {!showCustom ? (
          <button
            onClick={handleCustomClick}
            className={`
              py-4 px-6 text-lg font-light border-2 transition-all
              ${
                !isPresetSelected
                  ? "border-neutral-800 bg-neutral-800 text-white"
                  : "border-neutral-200 hover:border-neutral-400 text-neutral-800"
              }
            `}
          >
            Custom
          </button>
        ) : (
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={customInput}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="20"
              autoFocus
              className="w-full py-4 px-6 text-lg font-light border-2 border-neutral-800 bg-white text-neutral-800 focus:outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg font-light text-neutral-400">
              %
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
