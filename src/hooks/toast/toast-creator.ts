
import { dispatch, actionTypes } from "./toast-reducer";
import type { Toast, ToastFunction, ToasterToast } from "./toast-types";

// Generate unique ID for each toast
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Core toast function
export const createToast: ToastFunction = (props: Toast) => {
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
createToast.success = (message: string) => {
  return createToast({ 
    title: "Success", 
    description: message, 
    variant: "default" 
  });
};

createToast.error = (message: string) => {
  return createToast({ 
    title: "Error", 
    description: message, 
    variant: "destructive" 
  });
};

createToast.info = (message: string) => {
  return createToast({ 
    title: "Info", 
    description: message,
    variant: "default"
  });
};

createToast.warning = (message: string) => {
  return createToast({ 
    title: "Warning", 
    description: message,
    variant: "destructive"
  });
};

export const toast = createToast;
