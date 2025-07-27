'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'page' | 'component' | 'global';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // 에러 로깅 서비스에 전송 (예: Sentry, LogRocket 등)
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // 프로덕션에서는 실제 에러 로깅 서비스로 전송
    if (process.env.NODE_ENV === 'production') {
      // 에러 정보를 안전하게 정리
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      };

      // 실제 로깅 서비스 호출 (여기서는 콘솔에만 출력)
      console.error('Error logged:', errorData);
      
      // 서비스로 전송하는 코드 예시:
      // fetch('/api/log-error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData)
      // }).catch(e => console.error('Failed to log error:', e));
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const { error, errorInfo } = this.state;
    const bugReport = {
      error: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      component: errorInfo?.componentStack || 'Unknown component',
      timestamp: new Date().toISOString(),
    };

    // 버그 리포트 기능 (실제로는 이슈 트래커나 이메일로 전송)
    const subject = encodeURIComponent('Bug Report: Application Error');
    const body = encodeURIComponent(`
버그 리포트:

오류 메시지: ${bugReport.error}

스택 트레이스:
${bugReport.stack}

컴포넌트 스택:
${bugReport.component}

발생 시간: ${bugReport.timestamp}

추가 정보:
- URL: ${window.location.href}
- User Agent: ${navigator.userAgent}
    `);

    window.open(`mailto:support@mymoodlist.com?subject=${subject}&body=${body}`);
  };

  public render() {
    if (this.state.hasError) {
      // 커스텀 fallback이 제공된 경우 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 에러 레벨에 따른 다른 UI 제공
      const { level = 'component' } = this.props;
      
      return (
        <div className={`
          flex flex-col items-center justify-center p-8 
          ${level === 'global' ? 'min-h-screen bg-gray-50 dark:bg-gray-900' : 'min-h-[400px] bg-red-50 dark:bg-red-900/20'}
          rounded-lg border border-red-200 dark:border-red-800
        `}>
          <div className="text-center max-w-md">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {level === 'global' ? '앱에서 오류가 발생했습니다' : '컴포넌트 오류가 발생했습니다'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
              </p>
            </div>

            {/* 개발 환경에서만 에러 상세 정보 표시 */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <summary className="cursor-pointer font-medium text-gray-900 dark:text-white mb-2">
                  에러 상세 정보 (개발 모드)
                </summary>
                <div className="text-sm space-y-2">
                  <div>
                    <strong>메시지:</strong>
                    <p className="text-red-600 dark:text-red-400 font-mono">
                      {this.state.error.message}
                    </p>
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>스택 트레이스:</strong>
                      <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>다시 시도</span>
              </button>

              {level === 'global' && (
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>홈으로</span>
                </button>
              )}

              <button
                onClick={this.handleReportBug}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Bug className="w-4 h-4" />
                <span>버그 신고</span>
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              문제가 지속되면 고객 지원팀에 문의해주세요.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 특정 페이지용 Error Boundary
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="page">{children}</ErrorBoundary>
);

// 컴포넌트용 Error Boundary
export const ComponentErrorBoundary: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <ErrorBoundary level="component" fallback={fallback}>{children}</ErrorBoundary>
);

// 전역용 Error Boundary
export const GlobalErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="global">{children}</ErrorBoundary>
);