
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Enter a valid email address';
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return '';
}

export function validateTerms(agreeTerms) {
  if (!agreeTerms) return 'You must agree to the terms';
  return '';
}

export function validateOtp(otp) {
  if (!otp || otp.length !== 6) return 'Enter a valid 6-digit OTP';
  return '';
}

// General string validator for cities or countries
export function validateNonEmptyString(value, fieldName = 'Field', minLen = 3, maxLen = 255) {
  if (!value || typeof value !== 'string') {
    return `${fieldName} is required.`;
  }

  const trimmed = value.trim();

  // Length validation
  if (trimmed.length < minLen) {
    return `${fieldName} must be at least ${minLen} characters long.`;
  }

  if (trimmed.length > maxLen) {
    return `${fieldName} must be at most ${maxLen} characters long.`;
  }

  // Allow only letters and single spaces between words
  const validPattern = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/;
  if (!validPattern.test(trimmed)) {
    return `${fieldName} must contain only letters and single spaces (no symbols, dots, or numbers).`;
  }

  return null; // ✅ valid
}

export function validateDescription(value, fieldName = 'Field', minLen = 3, maxLen = 255) {
  if (!value || typeof value !== 'string') {
    return `${fieldName} is required.`;
  }

  const trimmed = value.trim();

  // Length validation
  if (trimmed.length < minLen) {
    return `${fieldName} must be at least ${minLen} characters long.`;
  }

  if (trimmed.length > maxLen) {
    return `${fieldName} must be at most ${maxLen} characters long.`;
  }

  // Allow letters, numbers, spaces, and common punctuation
  const validPattern = /^[A-Za-z0-9 .,;:'"\-!?()]+$/;
  if (!validPattern.test(trimmed)) {
    return `${fieldName} may only contain letters, numbers, spaces, and common punctuation.`;
  }

  return null; // ✅ valid
}


// Age validator
export function validateAge(value, min = 16, max = 60) {
  const age = parseInt(value, 10);
  if (isNaN(age) || age < min || age > max) return `Age must be between ${min} and ${max}.`;
  return null;
}

// ---------------------------
// City validator
// ---------------------------
export function validateCity(value) {
    if (!value || typeof value !== 'string' || !value.trim()) {
    return "City is required.";
  }
  // Cities: min 2 chars, max 64 chars
  return validateNonEmptyString(value, 'City', 2, 64);
}

// ---------------------------
// Country validator
// ---------------------------
export function validateCountry(value, allowedCountries = []) {
  if (!value || typeof value !== 'string' || !value.trim()) {
    return "Country is required.";
  }

  const trimmed = value.trim();

  if (allowedCountries.length > 0 && !allowedCountries.includes(trimmed)) {
    return "Select a valid country.";
  }

  // Optional: enforce same letters + single space rules
  const validPattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  if (!validPattern.test(trimmed)) {
    return "Country must contain only letters and single spaces (no symbols, dots, or numbers).";
  }

  return null;
}

export const validateOptionalString = (value, fieldName = "Field", minLen = 1, maxLen = 255, allowSpecial = false) => {
  if (!value || value.trim() === "") {
    return null; // optional → valid if empty
  }

  const v = value.trim();

  if (v.length < minLen) {
    return `${fieldName} must be at least ${minLen} characters long.`;
  }

  if (v.length > maxLen) {
    return `${fieldName} must be at most ${maxLen} characters long.`;
  }

  if (!allowSpecial && !/^[A-Za-z0-9\s-]+$/.test(v)) {
    return `${fieldName} must contain only letters, numbers, spaces, or hyphens.`;
  }

  return null;
};

export const validateOptionalDateRange = (startDate, endDate, ongoing = false) => {
  if (!startDate) return "Start date is required.";

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (!ongoing && !endDate) {
    return "End date is required unless marked as ongoing.";
  }

  if (end && start > end) {
    return "End date cannot be earlier than start date.";
  }

  return null;
};

export const validateOptionalYearRange = (startYear, endYear) => {
  if (!startYear && !endYear) return null; // optional
  if (!startYear) return "Start year is required.";
  if (!endYear) return "End year is required.";
  if (Number(startYear) > Number(endYear)) return "End year cannot be earlier than start year.";
  return null;
};

export const validateLanguage = (lang) => {
  const allowedLanguages = ['english', 'malayalam', 'spanish', 'french', 'german', 'chinese', 'hindi'];
  const allowedLevels = ['beginner', 'intermediate', 'advanced', 'native'];

  let errors = {};

  if (!lang.name) errors.name = "Language is required.";
  else if (!allowedLanguages.includes(lang.name.toLowerCase())) errors.name = "Invalid language selected.";

  if (!lang.proficiency) errors.proficiency = "Proficiency level is required.";
  else if (!allowedLevels.includes(lang.proficiency.toLowerCase())) errors.proficiency = "Invalid proficiency level.";

  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateURL = (value, fieldName = "URL") => {
  if (!value || value.trim() === "") return null; // optional
  try {
    new URL(value);
    return null;
  } catch {
    return `${fieldName} must be a valid URL.`;
  }
};