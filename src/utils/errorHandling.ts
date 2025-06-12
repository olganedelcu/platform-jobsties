
export interface SanitizedError {
  message: string;
  code?: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalInfo?: Record<string, any>;
}

export class SecureErrorHandler {
  static handleError(error: any, context?: ErrorContext): SanitizedError {
    console.error('Error occurred:', error, context);
    
    // Sanitize the error to avoid exposing sensitive information
    const sanitizedError: SanitizedError = {
      message: this.getSafeErrorMessage(error),
      code: error?.code || error?.status?.toString(),
      severity: this.determineSeverity(error),
      timestamp: new Date()
    };

    return sanitizedError;
  }

  private static getSafeErrorMessage(error: any): string {
    // Common error patterns that are safe to show
    if (error?.message) {
      const message = error.message;
      
      // Database errors
      if (message.includes('duplicate key value')) {
        return 'This record already exists.';
      }
      
      // Auth errors
      if (message.includes('Invalid login credentials')) {
        return 'Invalid email or password.';
      }
      
      if (message.includes('Email not confirmed')) {
        return 'Please check your email and confirm your account.';
      }
      
      // Network errors
      if (message.includes('Failed to fetch') || message.includes('Network Error')) {
        return 'Network connection error. Please try again.';
      }
      
      // Permission errors
      if (message.includes('permission') || message.includes('unauthorized')) {
        return 'You do not have permission to perform this action.';
      }
      
      // Return the original message if it seems safe
      return message;
    }
    
    // Fallback for unknown errors
    return 'An unexpected error occurred. Please try again.';
  }

  private static determineSeverity(error: any): 'low' | 'medium' | 'high' {
    const message = error?.message?.toLowerCase() || '';
    const code = error?.code || error?.status;
    
    // High severity errors
    if (code >= 500 || message.includes('server') || message.includes('database')) {
      return 'high';
    }
    
    // Medium severity errors
    if (code >= 400 || message.includes('unauthorized') || message.includes('forbidden')) {
      return 'medium';
    }
    
    // Low severity errors (client-side validation, etc.)
    return 'low';
  }

  static isRetryableError(code: string): boolean {
    const retryableCodes = ['NETWORK_ERROR', 'TIMEOUT', '500', '502', '503', '504'];
    return retryableCodes.includes(code);
  }
}
