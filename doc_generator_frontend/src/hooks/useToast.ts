import { useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';

interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

const ToastContainer = styled('div')<{ severity: ToastState['severity']; }>(({ theme, severity }) => ({
  position: 'fixed',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '12px 24px',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '14px',
  zIndex: 9999,
  backgroundColor: severity === 'error' ? '#d32f2f' :
                   severity === 'warning' ? '#ed6c02' :
                   severity === 'success' ? '#2e7d32' :
                   '#0288d1',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  transition: 'opacity 0.3s ease-in-out',
  opacity: 0,
  '&.visible': {
    opacity: 1
  }
}));

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showToast = useCallback(
    (message: string, severity: ToastState['severity'] = 'info') => {
      setToast({ open: true, message, severity });
      setTimeout(() => {
        setToast(prev => ({ ...prev, open: false }));
      }, 6000);
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  const ToastComponent = useCallback(
    () => (
      toast.open ? (
        <ToastContainer 
          severity={toast.severity}
          className={toast.open ? 'visible' : ''}
          onClick={hideToast}
        >
          {toast.message}
        </ToastContainer>
      ) : null
    ),
    [toast, hideToast]
  );

  return { showToast, ToastComponent };
}