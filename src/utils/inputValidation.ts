
import DOMPurify from 'dompurify';

// Input validation rules and patterns
export const ValidationRules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-()]{10,15}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericWithSpaces: /^[a-zA-Z0-9\s]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s\-_]+$/,
  safeText: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  date: /^\d{4}-\d{2}-\d{2}$/,
  time: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  sqlInjectionPatterns: [
    /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT|MERGE|SELECT|UPDATE|UNION|SCRIPT)\b)/gi,
    /('|('')|(--)|;|\s*(\|\|)\s*)/gi,
    /(\b(OR|AND)\b.*\b(=|LIKE)\b)/gi,
    /(\bUNION\b.*\bSELECT\b)/gi
  ],
  xssPatterns: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
  ]
};

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'format' | 'length' | 'security' | 'custom';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedValue?: Record<string, unknown>;
}

// Input sanitization class
export class InputSanitizer {
  static sanitizeText(input: string, options: {
    allowHtml?: boolean;
    maxLength?: number;
    removeScripts?: boolean;
    removeSqlPatterns?: boolean;
  } = {}): string {
    if (!input || typeof input !== 'string') return '';

    const {
      allowHtml = false,
      maxLength = 1000,
      removeScripts = true,
      removeSqlPatterns = true
    } = options;

    let sanitized = input.trim();

    // Limit length
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    // Remove SQL injection patterns
    if (removeSqlPatterns) {
      ValidationRules.sqlInjectionPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
      });
    }

    // Handle HTML content
    if (allowHtml) {
      // Use DOMPurify for safe HTML sanitization
      sanitized = DOMPurify.sanitize(sanitized, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: []
      });
    } else {
      // Remove all HTML tags and encode special characters
      sanitized = sanitized
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }

    // Remove XSS patterns
    if (removeScripts) {
      ValidationRules.xssPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
      });
    }

    return sanitized;
  }

  static sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') return '';
    
    return email
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9@._-]/g, '')
      .substring(0, 254); // RFC 5321 limit
  }

  static sanitizeUrl(url: string): string {
    if (!url || typeof url !== 'string') return '';
    
    const sanitized = url.trim();
    
    // Only allow http and https protocols
    if (!sanitized.match(/^https?:\/\//)) {
      return '';
    }
    
    try {
      new URL(sanitized); // Validate URL format
      return sanitized;
    } catch {
      return '';
    }
  }

  static sanitizeFileName(fileName: string): string {
    if (!fileName || typeof fileName !== 'string') return '';
    
    return fileName
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 255);
  }

  static sanitizeNumericString(value: string): string {
    if (!value || typeof value !== 'string') return '';
    
    return value.replace(/[^0-9.-]/g, '');
  }
}

// Input validator class
export class InputValidator {
  static validateRequired(value: unknown, fieldName: string): ValidationError | null {
    if (value === null || value === undefined || value === '') {
      return {
        field: fieldName,
        message: `${fieldName} is required`,
        type: 'required'
      };
    }
    return null;
  }

  static validateEmail(email: string, fieldName: string = 'Email'): ValidationError | null {
    if (!email || !ValidationRules.email.test(email)) {
      return {
        field: fieldName,
        message: 'Please enter a valid email address',
        type: 'format'
      };
    }
    return null;
  }

  static validateUrl(url: string, fieldName: string = 'URL'): ValidationError | null {
    if (!url || !ValidationRules.url.test(url)) {
      return {
        field: fieldName,
        message: 'Please enter a valid URL',
        type: 'format'
      };
    }
    return null;
  }

  static validateLength(
    value: string, 
    min: number, 
    max: number, 
    fieldName: string
  ): ValidationError | null {
    if (!value) return null;
    
    if (value.length < min || value.length > max) {
      return {
        field: fieldName,
        message: `${fieldName} must be between ${min} and ${max} characters`,
        type: 'length'
      };
    }
    return null;
  }

  static validatePattern(
    value: string, 
    pattern: RegExp, 
    fieldName: string, 
    message: string
  ): ValidationError | null {
    if (!value) return null;
    
    if (!pattern.test(value)) {
      return {
        field: fieldName,
        message,
        type: 'format'
      };
    }
    return null;
  }

  static validateSecurityThreats(value: string, fieldName: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!value || typeof value !== 'string') return errors;

    // Check for SQL injection patterns
    const hasSqlInjection = ValidationRules.sqlInjectionPatterns.some(pattern => 
      pattern.test(value)
    );
    
    if (hasSqlInjection) {
      errors.push({
        field: fieldName,
        message: 'Input contains potentially dangerous SQL patterns',
        type: 'security'
      });
    }

    // Check for XSS patterns
    const hasXss = ValidationRules.xssPatterns.some(pattern => 
      pattern.test(value)
    );
    
    if (hasXss) {
      errors.push({
        field: fieldName,
        message: 'Input contains potentially dangerous script content',
        type: 'security'
      });
    }

    return errors;
  }

  static validateUUID(uuid: string, fieldName: string = 'ID'): ValidationError | null {
    if (!uuid || !ValidationRules.uuid.test(uuid)) {
      return {
        field: fieldName,
        message: 'Invalid ID format',
        type: 'format'
      };
    }
    return null;
  }

  static validateDate(date: string, fieldName: string = 'Date'): ValidationError | null {
    if (!date || !ValidationRules.date.test(date)) {
      return {
        field: fieldName,
        message: 'Please enter a valid date (YYYY-MM-DD)',
        type: 'format'
      };
    }
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return {
        field: fieldName,
        message: 'Please enter a valid date',
        type: 'format'
      };
    }
    
    return null;
  }
}

// Form validation utility
export class FormValidator {
  static validate(data: Record<string, unknown>, rules: Record<string, Record<string, unknown>>): ValidationResult {
    const errors: ValidationError[] = [];
    const sanitizedData: Record<string, unknown> = {};

    Object.keys(rules).forEach(fieldName => {
      const fieldRules = rules[fieldName];
      const fieldValue = data[fieldName];
      
      // Required validation
      if (fieldRules.required) {
        const requiredError = InputValidator.validateRequired(fieldValue, fieldName);
        if (requiredError) {
          errors.push(requiredError);
          return;
        }
      }

      // Skip other validations if field is empty and not required
      if (!fieldValue && !fieldRules.required) {
        sanitizedData[fieldName] = fieldValue;
        return;
      }

      // Security validation
      if (fieldRules.checkSecurity !== false && typeof fieldValue === 'string') {
        const securityErrors = InputValidator.validateSecurityThreats(fieldValue, fieldName);
        errors.push(...securityErrors);
      }

      // Type-specific validation and sanitization
      let sanitizedValue: unknown = fieldValue;

      if (typeof fieldValue === 'string') {
        if (fieldRules.type === 'email') {
          const emailError = InputValidator.validateEmail(fieldValue, fieldName);
          if (emailError) errors.push(emailError);
          sanitizedValue = InputSanitizer.sanitizeEmail(fieldValue);
        } else if (fieldRules.type === 'url') {
          const urlError = InputValidator.validateUrl(fieldValue, fieldName);
          if (urlError) errors.push(urlError);
          sanitizedValue = InputSanitizer.sanitizeUrl(fieldValue);
        } else if (fieldRules.type === 'text') {
          const minLength = typeof fieldRules.minLength === 'number' ? fieldRules.minLength : 0;
          const maxLength = typeof fieldRules.maxLength === 'number' ? fieldRules.maxLength : 1000;
          const lengthError = InputValidator.validateLength(
            fieldValue,
            minLength,
            maxLength,
            fieldName
          );
          if (lengthError) errors.push(lengthError);
          sanitizedValue = InputSanitizer.sanitizeText(fieldValue, {
            allowHtml: fieldRules.allowHtml === true,
            maxLength: maxLength
          });
        } else if (fieldRules.type === 'uuid') {
          const uuidError = InputValidator.validateUUID(fieldValue, fieldName);
          if (uuidError) errors.push(uuidError);
        } else if (fieldRules.type === 'date') {
          const dateError = InputValidator.validateDate(fieldValue, fieldName);
          if (dateError) errors.push(dateError);
        }

        // Pattern validation
        if (fieldRules.pattern && fieldRules.pattern instanceof RegExp) {
          const patternMessage = typeof fieldRules.patternMessage === 'string'
            ? fieldRules.patternMessage
            : `${fieldName} format is invalid`;
          const patternError = InputValidator.validatePattern(
            fieldValue,
            fieldRules.pattern,
            fieldName,
            patternMessage
          );
          if (patternError) errors.push(patternError);
        }
      }

      // Custom validation
      if (fieldRules.custom && typeof fieldRules.custom === 'function') {
        const customError = fieldRules.custom(fieldValue, fieldName);
        if (customError) errors.push(customError);
      }

      sanitizedData[fieldName] = sanitizedValue;
    });

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedData
    };
  }
}

// Export utility functions for common use cases
export const sanitizeUserInput = (input: string, options?: {
  allowHtml?: boolean;
  maxLength?: number;
  removeScripts?: boolean;
  removeSqlPatterns?: boolean;
}) =>
  InputSanitizer.sanitizeText(input, options);

export const validateFormData = (data: Record<string, unknown>, rules: Record<string, Record<string, unknown>>) =>
  FormValidator.validate(data, rules);

export const isValidEmail = (email: string) => 
  !InputValidator.validateEmail(email);

export const isValidUrl = (url: string) => 
  !InputValidator.validateUrl(url);
