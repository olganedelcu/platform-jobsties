
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import Cal, { getCalApi } from "@calcom/embed-react";

interface ScheduleSessionProps {
  onSchedule: (sessionData: any) => void;
  onCancel: () => void;
  userId?: string;
}

const ScheduleSession = ({ onSchedule, onCancel, userId }: ScheduleSessionProps) => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"30min"});
      cal("ui", {"cssVarsPerTheme":{"dark":{"cal-brand":"#5b53e5"}},"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Cal 
        namespace="30min"
        calLink="ana-nedelcu/30min"
        style={{width:"100%",height:"100%",overflow:"scroll"}}
        config={{"layout":"month_view"}}
      />
    </div>
  );
};

export default ScheduleSession;
