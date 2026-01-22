
import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PageWrapper from '@/components/layout/PageWrapper';
import DashboardContent from '@/components/DashboardContent';
import { User } from '@supabase/supabase-js';

const Dashboard = memo(() => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        setUser(session.user);
        setLoading(false);
      } catch (error) {
        navigate('/login');
      }
    };

    checkUser();
  }, [navigate]);

  if (loading || !user) {
    return <PageWrapper loading={true} />;
  }

  return (
    <PageWrapper className="pt-20">
      <DashboardContent user={user} />
    </PageWrapper>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
