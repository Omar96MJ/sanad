
import { dispatch, actionTypes } from "./toast-reducer";
import type { Toast, ToastFunction, ToasterToast } from "./toast-types";

// Generate unique ID for each toast
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Core toast function
export const toast: ToastFunction = (props: Toast) => {
  const id = props.id || genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });
    
  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
};

// Add helper methods
toast.success = (message: string) => {
  return toast({ 
    title: "Success", 
    description: message, 
    variant: "default" 
  });
};

toast.error = (message: string) => {
  return toast({ 
    title: "Error", 
    description: message, 
    variant: "destructive" 
  });
};

toast.info = (message: string) => {
  return toast({ 
    title: "Info", 
    description: message,
    variant: "default"
  });
};

toast.warning = (message: string) => {
  return toast({ 
    title: "Warning", 
    description: message,
    variant: "destructive"
  });
};

// Explicitly export the toast function as baseToast for internal use
export { toast as baseToast };
