import { notifyError } from "@/composables/notifications";

export const handleError = (error: any, context: string) => {
  console.error(`Error during ${context}:`, error);
  if (error.response && error.response.status === 422) {
    const validationErrors = error.response.data.errors;
    console.error('Validation errors:', validationErrors);
    (Object.values(validationErrors) as string[][]).forEach((messages: string[]) => {
      messages.forEach((message: string) => notifyError(message));
    });
  } else {
    notifyError(`An error occurred during ${context}`);
  }
};
