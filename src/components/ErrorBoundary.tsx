import * as React from "react";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";
import { logger, autoHeal } from "@/lib/logger";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    logger.error("Uncaught Runtime Error", { 
      error: error.toString(), 
      componentStack: errorInfo.componentStack 
    });
    
    // Attempt Auto-Heal
    if (autoHeal()) {
        window.location.reload();
    }
  }

  handleHardReset = () => {
    if (confirm("Isso apagará todos os dados locais e redefinirá o aplicativo. Use apenas se não conseguir acessar nada. Continuar?")) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
            <div className="max-w-md w-full text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold font-serif">Ops! Algo deu errado.</h1>
                <p className="text-muted-foreground">
                  Ocorreu um erro inesperado na aplicação.
                </p>
              </div>

              {this.state.error && (
                <div className="bg-muted p-4 rounded-lg text-left overflow-auto max-h-40 border border-border">
                  <p className="text-xs font-mono text-destructive">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors w-full"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Tentar Novamente
                  </button>

                  <button
                    onClick={this.handleHardReset}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-destructive/10 text-destructive font-medium rounded-md hover:bg-destructive/20 transition-colors w-full"
                  >
                    <Trash2 className="w-4 h-4" />
                    Resetar Aplicativo (Emergência)
                  </button>
              </div>
              
              <p className="text-xs text-muted-foreground pt-4">
                O erro foi registrado automaticamente para análise.
              </p>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
