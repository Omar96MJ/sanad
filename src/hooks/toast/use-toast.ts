
import * as React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { getMemoryState, subscribe, dispatch, actionTypes } from "./toast-reducer";
import { toast as baseToast } from "./toast-creator";
import type { ToastFunction, UseToastReturnType } from "./toast-types";

export function useToast(): UseToastReturnType {
  const [state, setState] = React.useState(getMemoryState());
  const { t } = useLanguage();

  React.useEffect(() => {
    const unsubscribe = subscribe(setState);
    return unsubscribe;
  }, []);

  const translatedToast: Partial<ToastFunction> = React.useMemo(() => {
    return {
      success: (message: string) => baseToast({ 
        title: t('success'), 
        description: message, 
        variant: "default" 
      }),
      error: (message: string) => baseToast({ 
        title: t('error'), 
        description: message, 
        variant: "destructive" 
      }),
      info: (message: string) => baseToast({ 
        title: t('info'), 
        description: message,
        variant: "default"
      }),
      warning: (message: string) => baseToast({ 
        title: t('warning'), 
        description: message,
        variant: "destructive"
      }),
    };
  }, [t]);

  const toast = Object.assign(baseToast, translatedToast) as ToastFunction;

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

export { baseToast as toast } from "./toast-creator";
