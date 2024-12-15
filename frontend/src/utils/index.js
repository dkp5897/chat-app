// Form Validation Function
export const validateForm = (formData) => {
    const errors = {};
  
    if (!formData.name || formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = "Invalid email address";
    }
  
    if (!formData.password || formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
  
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  
    return errors;
  };