"use client";

import { useState } from "react";
import {
  calculateTip,
  calculateTotal,
  calculateSplit,
  applyRounding,
  validateBillAmount,
  formatWithSeparators,
  type RoundMode,
} from "@/lib/calculations";
import TipSelector from "./TipSelector";
import SplitToggle from "./SplitToggle";
import RoundToggle from "./RoundToggle";

export default function Calculator() {
  // Core state
  const [billAmount, setBillAmount] = useState<number>(0);
  const [billInput, setBillInput] = useState<string>("");
  const [tipPercent, setTipPercent] = useState<number>(18);

  // Feature toggles
  const [splitEnabled, setSplitEnabled] = useState<boolean>(false);
  const [splitCount, setSplitCount] = useState<number>(2);
  const [roundEnabled, setRoundEnabled] = useState<boolean>(false);
  const [roundMode, setRoundMode] = useState<RoundMode>("up");

  // Warnings and errors
  const [largeAmountWarning, setLargeAmountWarning] = useState<boolean>(false);
  const [previousBill, setPreviousBill] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [drasticChangeWarning, setDrasticChangeWarning] =
    useState<boolean>(false);

  // Calculations
  const tipAmount = calculateTip(billAmount, tipPercent);
  const subtotal = calculateTotal(billAmount, tipAmount);
  const finalTotal = roundEnabled
    ? applyRounding(subtotal, roundMode)
    : subtotal;
  const splitResult = splitEnabled
    ? calculateSplit(finalTotal, splitCount)
    : null;

  // Handle bill amount changes
  const handleBillChange = (value: string) => {
    // Strip all non-numeric chars except first decimal point
    let cleanedInput = value.replace(/[^\d.]/g, "");

    // Only allow one decimal point - keep the first one
    const firstDecimalIndex = cleanedInput.indexOf(".");
    if (firstDecimalIndex !== -1) {
      cleanedInput =
        cleanedInput.slice(0, firstDecimalIndex + 1) +
        cleanedInput.slice(firstDecimalIndex + 1).replace(/\./g, "");
    }

    // Add leading zero for decimal-first input (.99 → 0.99)
    if (cleanedInput.startsWith(".")) {
      cleanedInput = "0" + cleanedInput;
    }

    setBillInput(cleanedInput);

    const validation = validateBillAmount(cleanedInput);

    // Handle errors (CC number, invalid input, etc.)
    if (!validation.isValid) {
      setErrorMessage(validation.error || "Invalid input");
      setBillAmount(0);
      setLargeAmountWarning(false);
      setDrasticChangeWarning(false);
      return;
    }

    // Clear error on valid input
    setErrorMessage("");

    // Check for drastic changes if split is enabled
    if (
      splitEnabled &&
      previousBill > 0 &&
      validation.sanitized > 0 &&
      Math.abs(validation.sanitized - previousBill) > previousBill * 0.5
    ) {
      // Significant change detected
      setDrasticChangeWarning(true);
    } else {
      setDrasticChangeWarning(false);
    }

    setBillAmount(validation.sanitized);

    // Only update previousBill for non-zero amounts
    if (validation.sanitized > 0) {
      setPreviousBill(validation.sanitized);
    }

    // Show warning for large amounts
    if (validation.warning) {
      setLargeAmountWarning(true);
    } else {
      setLargeAmountWarning(false);
    }
  };

  // Debounce for rapid tapping prevention
  const [lastTipChange, setLastTipChange] = useState<number>(0);

  const handleTipChange = (percent: number) => {
    const now = Date.now();
    if (now - lastTipChange < 500) return; // Debounce 0.5s

    setTipPercent(percent);
    setLastTipChange(now);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-12">
        {/* Bill Amount Input */}
        <div className="space-y-4">
          <label
            htmlFor="bill"
            className="block text-sm uppercase tracking-wider text-neutral-600"
          >
            Bill Amount
          </label>
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-6xl font-light text-neutral-800">
              $
            </span>
            <input
              id="bill"
              type="text"
              inputMode="decimal"
              value={billInput}
              onChange={(e) => handleBillChange(e.target.value)}
              placeholder="0.00"
              className="w-full pl-12 text-6xl font-light text-neutral-800 bg-transparent border-b-2 border-neutral-200 focus:border-neutral-800 focus:outline-none transition-colors placeholder:text-neutral-300"
            />
          </div>
          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
          {largeAmountWarning && billAmount > 10000 && !errorMessage && (
            <p className="text-sm text-amber-600">
              That&apos;s a large amount - {formatWithSeparators(billAmount)}
            </p>
          )}
          {drasticChangeWarning && splitEnabled && !errorMessage && (
            <p className="text-sm text-amber-600">
              Amount changed significantly. Still splitting between {splitCount}
              ?
            </p>
          )}
        </div>

        {/* Tip Selector */}
        {billAmount > 0 ? (
          <TipSelector
            selectedPercent={tipPercent}
            onPercentChange={handleTipChange}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-400">
              Enter your bill amount to calculate tip
            </p>
          </div>
        )}

        {/* Results Display */}
        {billAmount > 0 && (
          <div className="space-y-6 pt-8 border-t border-neutral-200">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider text-neutral-600">
                Tip ({tipPercent}%)
              </span>
              <span className="text-3xl font-light text-neutral-800">
                ${tipAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider text-neutral-600">
                Total
              </span>
              <span className="text-4xl font-light text-neutral-800">
                ${finalTotal.toFixed(2)}
              </span>
            </div>

            {splitResult && splitResult.remainder > 0 && (
              <div className="text-sm text-neutral-500">
                {splitResult.distribution}
              </div>
            )}

            {splitResult && splitResult.remainder === 0 && (
              <div className="flex justify-between items-baseline">
                <span className="text-sm uppercase tracking-wider text-neutral-600">
                  Per Person
                </span>
                <span className="text-3xl font-light text-neutral-800">
                  ${splitResult.perPerson.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Feature Toggles */}
        {billAmount > 0 && (
          <div className="space-y-4 pt-8 border-t border-neutral-200">
            <SplitToggle
              enabled={splitEnabled}
              count={splitCount}
              onToggle={() => setSplitEnabled(!splitEnabled)}
              onCountChange={setSplitCount}
            />

            <RoundToggle
              enabled={roundEnabled}
              mode={roundMode}
              onToggle={() => setRoundEnabled(!roundEnabled)}
              onModeChange={setRoundMode}
            />
          </div>
        )}
      </div>
    </div>
  );
}
