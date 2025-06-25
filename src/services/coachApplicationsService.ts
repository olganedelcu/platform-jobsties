import { fetchMenteeApplications } from './coach/fetchCoachApplicationsService';
import { updateCoachMenteeApplication } from './coach/updateCoachApplicationService';
import { hideCoachMenteeApplication } from './coach/hideCoachApplicationService';

// Re-export all functions for backward compatibility
export { fetchMenteeApplications, updateCoachMenteeApplication, hideCoachMenteeApplication };

// Keep the old function name for backward compatibility but make it use the new hide functionality
export const deleteCoachMenteeApplication = hideCoachMenteeApplication;
