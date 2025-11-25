// Password strength calculator utility

export type PasswordStrength = "weak" | "fair" | "good" | "strong";

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-4
  feedback: string[];
  color: string;
  percentage: number;
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  let score = 0;
  const feedback: string[] = [];

  // Check password length
  if (password.length >= 8) {
    score++;
  } else {
    feedback.push("At least 8 characters");
  }

  if (password.length >= 12) {
    score++;
  }

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push("Add lowercase letters");
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push("Add uppercase letters");
  }

  // Check for numbers
  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push("Add numbers");
  }

  // Check for special characters
  if (/[!@#$%^&*=]/.test(password)) {
    score++;
  } else {
    feedback.push("Add special characters (!@#$%^&*=)");
  }

  // Determine strength
  let strength: PasswordStrength = "weak";
  let color = "rgb(239, 68, 68)"; // red-500
  let percentage = 25;

  if (score <= 2) {
    strength = "weak";
    color = "rgb(239, 68, 68)"; // red-500
    percentage = 25;
  } else if (score <= 4) {
    strength = "fair";
    color = "rgb(251, 146, 60)"; // orange-400
    percentage = 50;
  } else if (score <= 5) {
    strength = "good";
    color = "rgb(234, 179, 8)"; // yellow-500
    percentage = 75;
  } else {
    strength = "strong";
    color = "rgb(34, 197, 94)"; // green-500
    percentage = 100;
  }

  return {
    strength,
    score,
    feedback: feedback.slice(0, 2), // Show max 2 feedback items
    color,
    percentage,
  };
}
