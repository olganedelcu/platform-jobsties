
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  errorId: string;
  errorMessage: string;
}

class BackupErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorId: '',
      errorMessage: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `BACKUP_ERR_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      errorId,
      errorMessage: error.message || 'Unknown error'
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Sanitize error for logging
    const errorMessage = error.message || 'Unknown error';
    const sanitizedError = {
      message: errorMessage.replace(/\b[\w-]+@[\w.-]+\.\w+\b/g, '[EMAIL_REDACTED]'),
      stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      component: errorInfo.componentStack?.split('\n')[1]?.trim(),
      context: 'BackupSystem'
    };

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
    
    // Log for debugging
    console.error('Backup System Error:', sanitizedError);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorId: '', errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Backup System Error</CardTitle>
              <CardDescription>
                The backup system encountered an unexpected error. This could be due to network connectivity, 
                permissions, or server-side issues.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800 font-medium">Error Details:</p>
                <p className="text-sm text-red-700 mt-1">{this.state.errorMessage}</p>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Error ID: {this.state.errorId}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button 
                  onClick={this.handleRetry}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                >
                  Reload Page
                </Button>
                <Button 
                  onClick={() => window.location.href = '/coach/dashboard'}
                  variant="default"
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                If this problem persists, please contact support with the error ID above.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default BackupErrorBoundary;
