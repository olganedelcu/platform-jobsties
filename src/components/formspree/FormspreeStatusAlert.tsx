
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FormspreeStatusAlert = () => {
  return (
    <Alert>
      <AlertDescription className="text-green-700">
        ✅ <strong>Configuration Complete!</strong> Your Formspree endpoint has been automatically configured and is ready to send bundled email notifications to mentees.
      </AlertDescription>
    </Alert>
  );
};

export default FormspreeStatusAlert;
