/**
 * Core calculation functions for Tippr
 * All calculations handle edge cases and maintain 2 decimal precision
 */

export type RoundMode = "none" | "up" | "down";

/**
 * Formats a number to exactly 2 decimal places
 * Handles decimal precision edge cases
 */
export function formatCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculates tip amount from bill and percentage
 * @param billAmount - The original bill amount
 * @param tipPercent - Tip percentage (15 = 15%)
 * @returns Tip amount formatted to 2 decimals
 */
export function calculateTip(billAmount: number, tipPercent: number): number {
  if (billAmount <= 0 || tipPercent < 0) return 0;
  const tipAmount = billAmount * (tipPercent / 100);
  return formatCurrency(tipAmount);
}

/**
 * Calculates total including tip
 * @param billAmount - The original bill amount
 * @param tipAmount - The calculated tip amount
 * @returns Total formatted to 2 decimals
 */
export function calculateTotal(billAmount: number, tipAmount: number): number {
  return formatCurrency(billAmount + tipAmount);
}

/**
 * Applies rounding to a total amount
 * Always rounds to nearest dollar only
 * @param total - The total amount to round
 * @param mode - Rounding mode (none, up, down)
 * @returns Rounded total
 */
export function applyRounding(total: number, mode: RoundMode): number {
  if (mode === "none") return total;
  if (mode === "up") return Math.ceil(total);
  if (mode === "down") return Math.floor(total);
  return total;
}

/**
 * Calculates per-person amount when splitting bill
 * Handles penny distribution edge case
 * @param total - Total amount to split
 * @param splitCount - Number of people (min 1, max 50)
 * @returns Object with perPerson amount and distribution info
 */
export function calculateSplit(
  total: number,
  splitCount: number
): {
  perPerson: number;
  remainder: number;
  distribution: string;
} {
  // Clamp split count between 1 and 50
  const validSplitCount = Math.max(1, Math.min(50, Math.floor(splitCount)));

  // Calculate per-person amount
  const perPerson = formatCurrency(total / validSplitCount);

  // Calculate remainder for penny distribution
  const totalCents = Math.round(total * 100);
  const perPersonCents = Math.round(perPerson * 100);
  const distributedCents = perPersonCents * validSplitCount;
  const remainderCents = totalCents - distributedCents;

  // Generate distribution message for penny edge case
  let distribution = "";
  if (remainderCents > 0) {
    const peoplePayingMore = remainderCents;
    const peoplePayingBase = validSplitCount - peoplePayingMore;
    const higherAmount = formatCurrency((perPersonCents + 1) / 100);

    distribution = `${peoplePayingBase} pay $${perPerson.toFixed(2)}, ${peoplePayingMore} ${peoplePayingMore === 1 ? "pays" : "pay"} $${higherAmount.toFixed(2)}`;
  }

  return {
    perPerson,
    remainder: remainderCents,
    distribution,
  };
}

/**
 * Validates bill amount input
 * Blocks negative values, handles large amounts, detects CC numbers
 * @param value - Input value to validate
 * @returns Validation result with sanitized value, warnings, and errors
 */
export function validateBillAmount(value: string): {
  isValid: boolean;
  sanitized: number;
  warning?: string;
  error?: string;
} {
  // Handle empty input
  if (!value || value.trim() === "") {
    return {
      isValid: true,
      sanitized: 0,
    };
  }

  // Remove non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, "");

  // Handle multiple decimal points - only keep first one
  const parts = cleaned.split(".");
  const normalizedValue =
    parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleaned;

  // Detect credit card numbers (13-19 consecutive digits, no decimal)
  const digitsOnly = value.replace(/[^\d]/g, "");
  if (digitsOnly.length >= 13 && !value.includes(".")) {
    return {
      isValid: false,
      sanitized: 0,
      error: "Please enter a valid bill amount",
    };
  }

  // Parse as number
  const num = parseFloat(normalizedValue);

  // Check for invalid number
  if (isNaN(num) || num < 0) {
    return {
      isValid: false,
      sanitized: 0,
      error: "Please enter a valid bill amount",
    };
  }

  // Reject unreasonably large amounts (over $1 million - likely a mistake)
  if (num > 1000000) {
    return {
      isValid: false,
      sanitized: 0,
      error: "Please enter a valid bill amount",
    };
  }

  // Warn for large amounts (over $10,000)
  if (num > 10000) {
    return {
      isValid: true,
      sanitized: formatCurrency(num),
      warning: "That's a large amount - continue?",
    };
  }

  return {
    isValid: true,
    sanitized: formatCurrency(num),
  };
}

/**
 * Validates tip percentage input
 * Ensures numeric input only, caps at 100%
 * @param value - Input value to validate
 * @returns Validation result with sanitized value and warning
 */
export function validateTipPercent(value: string): {
  isValid: boolean;
  sanitized: number;
  warning?: string;
  capped?: boolean;
} {
  // Remove non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, "");

  // Handle multiple decimal points
  const parts = cleaned.split(".");
  const normalizedValue =
    parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleaned;

  // Parse as number
  const num = parseFloat(normalizedValue);

  // Check for invalid number or negative
  if (isNaN(num) || num < 0) {
    return {
      isValid: false,
      sanitized: 0,
    };
  }

  // Cap at 100% maximum
  if (num > 100) {
    return {
      isValid: true,
      sanitized: 100,
      warning: "Maximum tip is 100%",
      capped: true,
    };
  }

  return {
    isValid: true,
    sanitized: formatCurrency(num),
  };
}

/**
 * Formats number with thousand separators for clarity
 * Used for large amount display
 * @param value - Number to format
 * @returns Formatted string with commas
 */
export function formatWithSeparators(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
