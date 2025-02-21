export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validateSignupFormData = (formData: {
  [key: string]: string;
}): { [key: string]: string } | null => {
  let error: { [key: string]: string } = {};
  if (!formData.username) {
    error.username = "Username is required";
  }
  if (!formData.email) {
    error.email = "Email is required";
  }
  if (!formData.password) {
    error.password = "Password is required";
  }
  if (formData.password !== formData.confirmPassword) {
    error.confirmPassword = "Passwords do not match";
  }
  return Object.keys(error).length > 0 ? error : null;
};
