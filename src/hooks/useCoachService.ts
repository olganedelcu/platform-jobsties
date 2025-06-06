
import { useToast } from '@/hooks/use-toast';
import { coachService } from '@/services/coachService';

export const useCoachService = () => {
  const { toast } = useToast();

  const getCoachId = async (): Promise<string | null> => {
    const result = await coachService.getCoachId();
    
    if (!result.success) {
      switch (result.error) {
        case 'COACH_SETUP_REQUIRED':
          toast({
            title: "Coach Setup Required",
            description: "Ana needs to complete her coach profile setup. Please contact support.",
            variant: "destructive"
          });
          break;
        case 'INVALID_COACH_ROLE':
          toast({
            title: "Invalid Coach Role",
            description: "Ana's account is not set up as a coach. Please contact support.",
            variant: "destructive"
          });
          break;
        case 'CONNECTION_ERROR':
          toast({
            title: "Connection Error",
            description: "Unable to connect to coach services. Please try again later.",
            variant: "destructive"
          });
          break;
        default:
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again later.",
            variant: "destructive"
          });
      }
      return null;
    }
    
    return result.coachId;
  };

  return { getCoachId };
};
