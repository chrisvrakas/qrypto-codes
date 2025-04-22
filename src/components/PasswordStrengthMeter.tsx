
import React from "react";

function calculateStrength(password: string): number {
  let score = 0;
  if (!password) return 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 16) score++;
  return score;
}

export const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
  const score = calculateStrength(password);

  const bars = Array.from({ length: 5 }).map((_, idx) => (
    <div
      key={idx}
      className={`h-2 w-1/5 mx-0.5 rounded transition-all duration-200 ${
        idx < score
          ? ["bg-red-600", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-600"][score - 1]
          : "bg-gray-200"
      }`}
    />
  ));

  const label =
    score === 0
      ? "Too short"
      : score === 1
      ? "Weak"
      : score === 2
      ? "Fair"
      : score === 3
      ? "Good"
      : score === 4
      ? "Strong"
      : "Excellent";

  return (
    <div className="mt-2 mb-1">
      <div className="flex w-full">{bars}</div>
      <div className={`text-xs mt-1 ${score < 3 ? "text-red-600" : "text-green-700"}`}>{label}</div>
    </div>
  );
};
