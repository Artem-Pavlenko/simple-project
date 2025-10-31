import { toast, type ToastOptions } from "react-toastify";

// Default toast configuration
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Toast notification utilities
export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, { ...defaultOptions, ...options });
  },

  update: (
    toastId: string | number,
    message: string,
    type: "success" | "error" | "info" | "warning",
    options?: ToastOptions
  ) => {
    toast.update(toastId, {
      render: message,
      type,
      isLoading: false,
      ...defaultOptions,
      ...options,
    });
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },
};

// Adventure specific toast messages
export const adventureToasts = {
  createSuccess: (title: string) =>
    showToast.success(`Adventure "${title}" created successfully!`),
  createError: (error?: string) =>
    showToast.error(error || "Failed to create adventure"),

  updateSuccess: (title: string) =>
    showToast.success(`Adventure "${title}" updated successfully!`),
  updateError: (error?: string) =>
    showToast.error(error || "Failed to update adventure"),

  deleteSuccess: (title: string) =>
    showToast.success(`Adventure "${title}" deleted successfully!`),
  deleteError: (error?: string) =>
    showToast.error(error || "Failed to delete adventure"),

  exportSuccess: (title: string) =>
    showToast.success(`Adventure "${title}" exported successfully!`),
  exportError: (error?: string) =>
    showToast.error(error || "Failed to export adventure"),

  duplicateSuccess: (title: string) =>
    showToast.success(`Adventure "${title}" duplicated successfully!`),
  duplicateError: (error?: string) =>
    showToast.error(error || "Failed to duplicate adventure"),

  importSuccess: (title: string) =>
    showToast.success(`Adventure "${title}" imported successfully!`),
  importError: (error?: string) =>
    showToast.error(error || "Failed to import adventure"),
};

// Challenge specific toast messages
export const challengeToasts = {
  createSuccess: (title: string) =>
    showToast.success(`Challenge "${title}" created successfully!`),
  createError: (error?: string) =>
    showToast.error(error || "Failed to create challenge"),

  updateSuccess: (title: string) =>
    showToast.success(`Challenge "${title}" updated successfully!`),
  updateError: (error?: string) =>
    showToast.error(error || "Failed to update challenge"),

  deleteSuccess: (title: string) =>
    showToast.success(`Challenge "${title}" deleted successfully!`),
  deleteError: (error?: string) =>
    showToast.error(error || "Failed to delete challenge"),

  exportSuccess: (title: string) =>
    showToast.success(`Challenge "${title}" exported successfully!`),
  exportError: (error?: string) =>
    showToast.error(error || "Failed to export challenge"),

  saveSuccess: () => showToast.success("Flowchart saved", { autoClose: 2000 }),
  saveError: (error?: string) =>
    showToast.error(error || "Failed to save flowchart", { autoClose: 2000 }),

  tagChangedToDraft: () =>
    showToast.warning(
      "Challenge tag changed to 'Draft' due to validation errors",
      { autoClose: 4000 }
    ),
};
