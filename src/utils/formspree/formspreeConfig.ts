
// Helper function to check if Formspree notifications are enabled
export const isFormspreeEnabled = (): boolean => {
  // You can set this endpoint in your app configuration
  const endpoint = localStorage.getItem('formspree_endpoint');
  return !!endpoint;
};

// Helper function to get the Formspree endpoint
export const getFormspreeEndpoint = (): string | null => {
  return localStorage.getItem('formspree_endpoint');
};
