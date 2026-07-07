import { toast } from 'sonner';

/**
 * Exibe um toast estilizado com cores baseadas nas variáveis CSS do Design System:
 * - Status >= 500: vermelho usando a variável var(--error)
 * - Status >= 400: laranja/rosa usando a variável var(--tertiary)
 * - Status 200-299: verde usando a variável var(--success)
 * 
 * @param status Código HTTP da resposta
 * @param message Mensagem a ser exibida
 */
export const showResponseToast = (status: number, message: string) => {
  if (status >= 500) {
    toast.error(message, {
      style: {
        background: 'var(--error)',
        color: 'var(--on-error, #ffffff)',
        border: 'none',
      },
    });
  } else if (status >= 400) {
    toast.warning(message, {
      style: {
        background: 'var(--tertiary)',
        color: 'var(--on-tertiary, #ffffff)',
        border: 'none',
      },
    });
  } else if (status >= 200 && status < 300) {
    toast.success(message, {
      style: {
        background: 'var(--success)',
        color: 'var(--on-success, #ffffff)',
        border: 'none',
      },
    });
  }
};
