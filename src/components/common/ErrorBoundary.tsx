import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Centauri / Lyberate Uncaught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBFBF9] text-[#141413] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5E3DC] shadow-lg p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#991B1B]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold font-serif text-[#141413]">
                Se produjo un problema al cargar la vista
              </h1>
              <p className="text-sm text-[#5C5B56]">
                {this.state.error?.message || 'Ocurrió un error inesperado al procesar la aplicación.'}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium text-sm transition-colors shadow-sm"
              >
                Recargar página
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                  } catch {}
                  window.location.href = '/';
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F5F4EF] hover:bg-[#ECEAE3] text-[#141413] font-medium text-sm border border-[#E5E3DC] transition-colors"
              >
                Reiniciar caché e ir al inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
