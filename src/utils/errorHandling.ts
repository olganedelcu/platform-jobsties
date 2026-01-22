
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
  };

  static sanitizeMessage(message: string): string {
    let sanitized = message;
    
    // Remove sensitive information
    this.sensitivePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    // Limit message length
    if (sanitized.length > 200) {
      sanitized = sanitized.substring(0, 197) + '...';
    }

    return sanitized;
  }

  static categorizeError(error: Error | unknown): string {
    const errorObj = error as { message?: string; status?: number; code?: string };
    const message = errorObj?.message?.toLowerCase() || '';
    const status = errorObj?.status || errorObj?.code;

    if (status === 401 || message.includes('unauthorized')) {
      return 'UNAUTHORIZED';
    }
    if (status === 403 || message.includes('forbidden')) {
      return 'FORBIDDEN';
    }
    if (status === 404 || message.includes('not found')) {
      return 'NOT_FOUND';
    }
    if (status === 408 || message.includes('timeout')) {
      return 'TIMEOUT_ERROR';
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'NETWORK_ERROR';
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return 'VALIDATION_ERROR';
    }
    if (message.includes('calendar')) {
      return 'CALENDAR_ERROR';
    }
    if (message.includes('upload') || message.includes('file')) {
      return 'FILE_UPLOAD_ERROR';
    }
    if (message.includes('auth') || message.includes('login')) {
      return 'AUTHENTICATION_ERROR';
    }
    if (message.includes('database') || message.includes('sql')) {
      return 'DATABASE_ERROR';
    }
    
    return 'SERVER_ERROR';
  }

  static handleError(error: Error | unknown, context?: ErrorContext): SanitizedError {
    const errorId = `ERR_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 11)}`;
    const errorCode = this.categorizeError(error);
    const userFriendlyMessage = this.errorMessages[errorCode] || 'An unexpected error occurred.';

    const errorObj = error as { message?: string; stack?: string };

    // Log sanitized error for debugging (in production, send to monitoring service)
    const logData = {
      errorId,
      code: errorCode,
      originalMessage: this.sanitizeMessage(errorObj?.message || 'Unknown error'),
      context: {
        ...context,
        timestamp: new Date().toISOString(),
      },
      stack: errorObj?.stack?.split('\n').slice(0, 3).join('\n'), // Limited stack trace
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
}

export { SecureErrorHandler };
export type { SanitizedError, ErrorContext };
