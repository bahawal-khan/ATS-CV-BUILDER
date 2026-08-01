const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
const PHONE_REGEX = /^[0-9]{6,14}$/;

export function isValidEmail(value) {
  if (!value) return false;
  return EMAIL_REGEX.test(value.trim());
}

export function isValidPhone(value) {
  if (!value) return false;
  return PHONE_REGEX.test(value.trim());
}

export function validateResume(personal) {
  const errors = {};

  if (!personal.fullName || !personal.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }
  if (!isValidEmail(personal.email)) {
    errors.email = "Enter a valid email ending in @gmail.com.";
  }
  if (!isValidPhone(personal.phone)) {
    errors.phone = "Enter a valid phone number (6–14 digits, no spaces).";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}
