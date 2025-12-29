"use client";

import type { RoundMode } from "@/lib/calculations";

interface RoundToggleProps {
  enabled: boolean;
  mode: RoundMode;
  onToggle: () => void;
  onModeChange: (mode: RoundMode) => void;
}

export default function RoundToggle({
  enabled,
  mode,
  onToggle,
  onModeChange,
}: RoundToggleProps) {
  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-sm uppercase tracking-wider text-neutral-600 hover:text-neutral-800 transition-colors"
      >
        <span>Round Total</span>
        <span className="text-xs">{enabled ? "−" : "+"}</span>
      </button>

      {enabled && (
        <div className="pl-4 space-y-3 animate-in fade-in duration-200">
          <div className="flex gap-3">
            <button
              onClick={() => onModeChange("up")}
              className={`
                flex-1 py-3 px-4 text-sm border transition-all
                ${
                  mode === "up"
                    ? "border-neutral-800 bg-neutral-800 text-white"
                    : "border-neutral-200 hover:border-neutral-400 text-neutral-800"
                }
              `}
            >
              ↑ Round Up
            </button>

            <button
              onClick={() => onModeChange("down")}
              className={`
                flex-1 py-3 px-4 text-sm border transition-all
                ${
                  mode === "down"
                    ? "border-neutral-800 bg-neutral-800 text-white"
                    : "border-neutral-200 hover:border-neutral-400 text-neutral-800"
                }
              `}
            >
              ↓ Round Down
            </button>
          </div>

          <p className="text-xs text-neutral-400 text-center">
            Round to nearest dollar
          </p>
        </div>
      )}
    </div>
  );
}
