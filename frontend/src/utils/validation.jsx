
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
