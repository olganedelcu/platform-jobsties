
import { useState, useCallback, useMemo } from 'react';
import { FormValidator, ValidationResult, ValidationError } from '@/utils/inputValidation';

interface UseFormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  sanitizeInputs?: boolean;
}

interface UseFormValidationReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: unknown) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearErrors: () => void;
  markFieldTouched: (field: keyof T) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => Promise<void>;
  reset: () => void;
  validateField: (field: keyof T) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
}

export const useFormValidation = <T extends Record<string, unknown>>(
  initialValues: T,
  validationRules: Record<keyof T, Record<string, unknown>>,
  options: UseFormValidationOptions = {}
): UseFormValidationReturn<T> => {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    sanitizeInputs = true
  } = options;

  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<Record<string, string>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const validateField = useCallback(async (field: keyof T): Promise<boolean> => {
    const fieldValue = values[field];
    const fieldRules = validationRules[field];

    if (!fieldRules) return true;

    const result = FormValidator.validate(
      { [field]: fieldValue },
      { [field]: fieldRules }
    );

    if (result.errors.length > 0) {
      setErrorsState(prev => ({
        ...prev,
        [field]: result.errors[0].message
      }));
      return false;
    } else {
      setErrorsState(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });

      // Update with sanitized value if sanitization is enabled
      if (sanitizeInputs && result.sanitizedValue) {
        const sanitizedFieldValue = result.sanitizedValue[field as string];
        if (sanitizedFieldValue !== fieldValue) {
          setValuesState(prev => ({
            ...prev,
            [field]: sanitizedFieldValue
          }));
        }
      }

      return true;
    }
  }, [values, validationRules, sanitizeInputs]);

  const validateForm = useCallback(async (): Promise<boolean> => {
    const result = FormValidator.validate(values, validationRules);

    // Set all errors
    const newErrors: Record<string, string> = {};
    result.errors.forEach((error: ValidationError) => {
      if (!newErrors[error.field]) {
        newErrors[error.field] = error.message;
      }
    });

    setErrorsState(newErrors);

    // Update with sanitized values if sanitization is enabled
    if (sanitizeInputs && result.sanitizedValue) {
      setValuesState(prev => ({
        ...prev,
        ...result.sanitizedValue
      }));
    }

    return result.isValid;
  }, [values, validationRules, sanitizeInputs]);

  const setValue = useCallback((field: keyof T, value: unknown) => {
    setValuesState(prev => ({
      ...prev,
      [field]: value
    }));

    if (validateOnChange) {
      setTimeout(() => validateField(field), 0);
    }
  }, [validateOnChange, validateField]);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({
      ...prev,
      ...newValues
    }));

    if (validateOnChange) {
      setTimeout(() => {
        Object.keys(newValues).forEach(field => {
          validateField(field as keyof T);
        });
      }, 0);
    }
  }, [validateOnChange, validateField]);

  const setError = useCallback((field: keyof T, error: string) => {
    setErrorsState(prev => ({
      ...prev,
      [field as string]: error
    }));
  }, []);

  const clearError = useCallback((field: keyof T) => {
    setErrorsState(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrorsState({});
  }, []);

  const markFieldTouched = useCallback((field: keyof T) => {
    setTouchedState(prev => ({
      ...prev,
      [field as string]: true
    }));
  }, []);

  const handleBlur = useCallback((field: keyof T) => {
    markFieldTouched(field);
    
    if (validateOnBlur) {
      validateField(field);
    }
  }, [validateOnBlur, validateField, markFieldTouched]);

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void> | void) => {
    setIsSubmitting(true);
    
    try {
      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      Object.keys(values).forEach(key => {
        allTouched[key] = true;
      });
      setTouchedState(allTouched);

      // Validate entire form
      const isValidForm = await validateForm();
      
      if (isValidForm) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm]);

  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrorsState({});
    setTouchedState({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    setValues,
    setError,
    clearError,
    clearErrors,
    markFieldTouched,
    handleBlur,
    handleSubmit,
    reset,
    validateField,
    validateForm
  };
};
