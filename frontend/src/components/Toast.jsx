import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import './Toast.css';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts(prev =>
          prev.filter(toast => toast.id !== id)
        );
      }, duration);
    },
    []
  );

  const success = useCallback(
    message => showToast(message, 'success'),
    [showToast]
  );
  const error = useCallback(
    message => showToast(message, 'error'),
    [showToast]
  );
  const info = useCallback(
    message => showToast(message, 'info'),
    [showToast]
  );
  const warning = useCallback(
    message => showToast(message, 'warning'),
    [showToast]
  );

  const removeToast = useCallback(id => {
    setToasts(prev =>
      prev.filter(toast => toast.id !== id)
    );
  }, []);

  return (
    <ToastContext.Provider
      value={{ showToast, success, error, info, warning }}
    >
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
          >
            <span className="toast-message">
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="toast-close"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(
      'useToast deve ser usado dentro de um ToastProvider'
    );
  }
  return context;
};
