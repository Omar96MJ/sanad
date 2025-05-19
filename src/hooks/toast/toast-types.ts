
import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

export interface Toast extends Omit<ToasterToast, "id"> {
  id?: string;
}

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export interface UseToastReturnType {
  toasts: ToasterToast[];
  toast: ToastFunction;
  dismiss: (toastId?: string) => void;
}

export interface ToastFunction extends Function {
  (props: Toast): {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
  success: (message: string) => ReturnType<ToastFunction>;
  error: (message: string) => ReturnType<ToastFunction>;
  info: (message: string) => ReturnType<ToastFunction>;
  warning: (message: string) => ReturnType<ToastFunction>;
}
