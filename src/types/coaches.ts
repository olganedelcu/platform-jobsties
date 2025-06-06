
export interface Coach {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface CoachesHookReturn {
  coaches: Coach[];
  loading: boolean;
  refetchCoaches: () => Promise<void>;
}
