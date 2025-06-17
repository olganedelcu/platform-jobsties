
// Helper function to check if the current user is Ana
export const isAnaUser = (userEmail?: string): boolean => {
  const isAna = userEmail === 'ana@jobsties.com';
  console.log("🔍 Ana user check:", { userEmail, isAna });
  return isAna;
};
