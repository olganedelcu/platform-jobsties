
interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: string;
}

interface SanitizedError {
  message: string;
  code?: string;
  errorId: string;
  context?: ErrorContext;
}

class SecureErrorHandler {
  private static sensitivePatterns = [
    /\b[\w-]+@[\w.-]+\.\w+\b/g, // Email addresses
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, // Email patterns
    /password/gi,
    /token/gi,
    /key/gi,
    /secret/gi,
    /bearer\s+[\w-]+/gi,
    /authorization:\s*[\w-]+/gi,
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, // UUIDs
    /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, // Credit card patterns
    /\b\d{3}-\d{2}-\d{4}\b/g, // SSN patterns
  ];

  private static errorMessages: Record<string, string> = {
    NETWORK_ERROR: 'Connection failed. Please check your internet connection.',
    UNAUTHORIZED: 'Session expired. Please log in again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'Service temporarily unavailable. Please try again later.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    DATABASE_ERROR: 'Data operation failed. Please try again.',
    CALENDAR_ERROR: 'Calendar operation failed. Please try again.',
    FILE_UPLOAD_ERROR: 'File upload failed. Please try again.',
    AUTHENTICATION_ERROR: 'Authentication failed. Please try again.',
    DATA_PROCESSING_ERROR: 'Data processing failed. Please try again.',
    STRING_PROCESSING_ERROR: 'Text processing failed. Please try again.',
  };

  static sanitizeMessage(message: string): string {
    // Add comprehensive safety checks
    if (!message || typeof message !== 'string') {
      return 'Unknown error occurred';
    }
    
    let sanitized = message;
    
    // Remove sensitive information with error handling
    try {
      this.sensitivePatterns.forEach(pattern => {
        if (pattern && pattern instanceof RegExp) {
          sanitized = sanitized.replace(pattern, '[REDACTED]');
        }
      });
    } catch (patternError) {
      console.warn('Error applying sensitive pattern filters:', patternError);
    }

    // Limit message length
    if (sanitized.length > 200) {
      sanitized = sanitized.substring(0, 197) + '...';
    }

    return sanitized;
  }

  static categorizeError(error: Error | any): string {
    // Comprehensive safety checks for all error properties
    let message = '';
    let status = null;

    try {
      // Safely extract message
      if (error && typeof error === 'object') {
        if (error.message && typeof error.message === 'string') {
          message = error.message.toLowerCase();
        }
        // Safely extract status
        status = error.status || error.code || null;
      }
    } catch (extractionError) {
      console.warn('Error extracting error properties:', extractionError);
      message = '';
      status = null;
    }

    // Safe string operations with additional checks
    try {
      if (status === 401 || (message && message.includes('unauthorized'))) {
        return 'UNAUTHORIZED';
      }
      if (status === 403 || (message && message.includes('forbidden'))) {
        return 'FORBIDDEN';
      }
      if (status === 404 || (message && message.includes('not found'))) {
        return 'NOT_FOUND';
      }
      if (status === 408 || (message && message.includes('timeout'))) {
        return 'TIMEOUT_ERROR';
      }
      if (message && (message.includes('network') || message.includes('fetch'))) {
        return 'NETWORK_ERROR';
      }
      if (message && (message.includes('validation') || message.includes('invalid'))) {
        return 'VALIDATION_ERROR';
      }
      if (message && message.includes('calendar')) {
        return 'CALENDAR_ERROR';
      }
      if (message && (message.includes('upload') || message.includes('file'))) {
        return 'FILE_UPLOAD_ERROR';
      }
      if (message && (message.includes('auth') || message.includes('login'))) {
        return 'AUTHENTICATION_ERROR';
      }
      if (message && (message.includes('database') || message.includes('sql'))) {
        return 'DATABASE_ERROR';
      }
      if (message && (message.includes('tolowercase') || message.includes('undefined') || message.includes('cannot read properties'))) {
        return 'STRING_PROCESSING_ERROR';
      }
      if (message && (message.includes('processing') || message.includes('formatting'))) {
        return 'DATA_PROCESSING_ERROR';
      }
    } catch (categorizationError) {
      console.warn('Error categorizing error:', categorizationError);
    }
    
    return 'SERVER_ERROR';
  }

  static handleError(error: Error | any, context?: ErrorContext): SanitizedError {
    const errorId = `ERR_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
    const errorCode = this.categorizeError(error);
    const userFriendlyMessage = this.errorMessages[errorCode] || 'An unexpected error occurred.';

    // Log sanitized error for debugging (in production, send to monitoring service)
    const logData = {
      errorId,
      code: errorCode,
      originalMessage: this.sanitizeMessage(error?.message || 'Unknown error'),
      context: {
        ...context,
        timestamp: new Date().toISOString(),
      },
      stack: error?.stack?.split('\n').slice(0, 3).join('\n'), // Limited stack trace
    };

    console.error('Handled Error:', logData);

    return {
      message: userFriendlyMessage,
      code: errorCode,
      errorId,
      context,
    };
  }

  static isRetryableError(errorCode: string): boolean {
    const retryableErrors = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'SERVER_ERROR',
      'DATABASE_ERROR',
      'CALENDAR_ERROR',
      'FILE_UPLOAD_ERROR',
    ];
    return retryableErrors.includes(errorCode);
  }

  // Helper function to safely process strings
  static safeStringOperation(value: any, operation: 'toLowerCase' | 'toUpperCase' | 'trim', fallback: string = ''): string {
    try {
      if (value === null || value === undefined) {
        return fallback;
      }
      
      const stringValue = typeof value === 'string' ? value : String(value);
      
      switch (operation) {
        case 'toLowerCase':
          return stringValue.toLowerCase();
        case 'toUpperCase':
          return stringValue.toUpperCase();
        case 'trim':
          return stringValue.trim();
        default:
          return stringValue;
      }
    } catch (error) {
      console.warn(`Safe string operation failed for ${operation}:`, error);
      return fallback;
    }
  }

  // Helper function to safely process arrays
  static safeArrayOperation<T>(value: any, fallback: T[] = []): T[] {
    try {
      if (Array.isArray(value)) {
        return value;
      }
      return fallback;
    } catch (error) {
      console.warn('Safe array operation failed:', error);
      return fallback;
    }
  }
}

export { SecureErrorHandler };
export type { SanitizedError, ErrorContext };
