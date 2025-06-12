
import React, { forwardRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InputSanitizer, InputValidator, ValidationError } from '@/utils/inputValidation';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface SecureInputProps extends React.ComponentProps<typeof Input> {
  sanitizeOptions?: {
    allowHtml?: boolean;
    maxLength?: number;
    removeScripts?: boolean;
    removeSqlPatterns?: boolean;
  };
  validationType?: 'email' | 'url' | 'text' | 'uuid' | 'date' | 'phone';
  validateOnChange?: boolean;
  showSecurityWarnings?: boolean;
  onValidationChange?: (isValid: boolean, errors: ValidationError[]) => void;
  onSanitizedValue?: (sanitizedValue: string) => void;
}

const SecureInput = forwardRef<HTMLInputElement, SecureInputProps>(({
  className,
  type = 'text',
  sanitizeOptions = {},
  validationType,
  validateOnChange = true,
  showSecurityWarnings = true,
  onValidationChange,
  onSanitizedValue,
  onChange,
  onBlur,
  value,
  ...props
}, ref) => {
  const [securityWarnings, setSecurityWarnings] = useState<ValidationError[]>([]);
  const [internalValue, setInternalValue] = useState(value || '');

  const sanitizeAndValidate = (inputValue: string) => {
    if (!inputValue || typeof inputValue !== 'string') return inputValue;

    // Sanitize the input
    let sanitized: string;
    
    switch (validationType) {
      case 'email':
        sanitized = InputSanitizer.sanitizeEmail(inputValue);
        break;
      case 'url':
        sanitized = InputSanitizer.sanitizeUrl(inputValue);
        break;
      default:
        sanitized = InputSanitizer.sanitizeText(inputValue, sanitizeOptions);
    }

    // Validate for security threats
    const securityErrors = InputValidator.validateSecurityThreats(inputValue, props.name || 'input');
    
    // Type-specific validation
    const validationErrors: ValidationError[] = [...securityErrors];
    
    if (validationType === 'email') {
      const emailError = InputValidator.validateEmail(sanitized, 'Email');
      if (emailError) validationErrors.push(emailError);
    } else if (validationType === 'url') {
      const urlError = InputValidator.validateUrl(sanitized, 'URL');
      if (urlError) validationErrors.push(urlError);
    } else if (validationType === 'uuid') {
      const uuidError = InputValidator.validateUUID(sanitized, 'ID');
      if (uuidError) validationErrors.push(uuidError);
    } else if (validationType === 'date') {
      const dateError = InputValidator.validateDate(sanitized, 'Date');
      if (dateError) validationErrors.push(dateError);
    }

    setSecurityWarnings(securityErrors);
    
    if (onValidationChange) {
      onValidationChange(validationErrors.length === 0, validationErrors);
    }

    if (onSanitizedValue && sanitized !== inputValue) {
      onSanitizedValue(sanitized);
    }

    return sanitized;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    if (validateOnChange) {
      const sanitizedValue = sanitizeAndValidate(rawValue);
      setInternalValue(sanitizedValue);
      
      // Create a new event with sanitized value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: sanitizedValue
        }
      };
      
      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    } else {
      setInternalValue(rawValue);
      onChange?.(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeAndValidate(e.target.value);
    setInternalValue(sanitizedValue);
    
    // Create a new event with sanitized value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: sanitizedValue
      }
    };
    
    onBlur?.(syntheticEvent as React.FocusEvent<HTMLInputElement>);
  };

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value.toString());
    }
  }, [value]);

  const hasSecurityWarnings = securityWarnings.length > 0 && showSecurityWarnings;

  return (
    <div className="relative">
      <Input
        className={cn(
          hasSecurityWarnings && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        type={type}
        ref={ref}
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
      
      {hasSecurityWarnings && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <AlertCircle className="h-4 w-4 text-red-500" />
        </div>
      )}
      
      {hasSecurityWarnings && (
        <div className="mt-1 text-xs text-red-600">
          {securityWarnings.map((warning, index) => (
            <div key={index}>{warning.message}</div>
          ))}
        </div>
      )}
    </div>
  );
});

SecureInput.displayName = "SecureInput";

// Secure Textarea component
interface SecureTextareaProps extends React.ComponentProps<typeof Textarea> {
  sanitizeOptions?: {
    allowHtml?: boolean;
    maxLength?: number;
    removeScripts?: boolean;
    removeSqlPatterns?: boolean;
  };
  validateOnChange?: boolean;
  showSecurityWarnings?: boolean;
  onValidationChange?: (isValid: boolean, errors: ValidationError[]) => void;
  onSanitizedValue?: (sanitizedValue: string) => void;
}

const SecureTextarea = forwardRef<HTMLTextAreaElement, SecureTextareaProps>(({
  className,
  sanitizeOptions = {},
  validateOnChange = true,
  showSecurityWarnings = true,
  onValidationChange,
  onSanitizedValue,
  onChange,
  onBlur,
  value,
  ...props
}, ref) => {
  const [securityWarnings, setSecurityWarnings] = useState<ValidationError[]>([]);
  const [internalValue, setInternalValue] = useState(value || '');

  const sanitizeAndValidate = (inputValue: string) => {
    if (!inputValue || typeof inputValue !== 'string') return inputValue;

    const sanitized = InputSanitizer.sanitizeText(inputValue, sanitizeOptions);
    const securityErrors = InputValidator.validateSecurityThreats(inputValue, props.name || 'textarea');
    
    setSecurityWarnings(securityErrors);
    
    if (onValidationChange) {
      onValidationChange(securityErrors.length === 0, securityErrors);
    }

    if (onSanitizedValue && sanitized !== inputValue) {
      onSanitizedValue(sanitized);
    }

    return sanitized;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawValue = e.target.value;
    
    if (validateOnChange) {
      const sanitizedValue = sanitizeAndValidate(rawValue);
      setInternalValue(sanitizedValue);
      
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: sanitizedValue
        }
      };
      
      onChange?.(syntheticEvent as React.ChangeEvent<HTMLTextAreaElement>);
    } else {
      setInternalValue(rawValue);
      onChange?.(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizeAndValidate(e.target.value);
    setInternalValue(sanitizedValue);
    
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: sanitizedValue
      }
    };
    
    onBlur?.(syntheticEvent as React.FocusEvent<HTMLTextAreaElement>);
  };

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value.toString());
    }
  }, [value]);

  const hasSecurityWarnings = securityWarnings.length > 0 && showSecurityWarnings;

  return (
    <div className="relative">
      <Textarea
        className={cn(
          hasSecurityWarnings && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        ref={ref}
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
      
      {hasSecurityWarnings && (
        <div className="absolute right-2 top-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
        </div>
      )}
      
      {hasSecurityWarnings && (
        <div className="mt-1 text-xs text-red-600">
          {securityWarnings.map((warning, index) => (
            <div key={index}>{warning.message}</div>
          ))}
        </div>
      )}
    </div>
  );
});

SecureTextarea.displayName = "SecureTextarea";

export { SecureInput, SecureTextarea };
