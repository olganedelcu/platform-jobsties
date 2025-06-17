
import React from 'react';

const FormspreeSystemStatus = () => {
  return (
    <div className="border-t pt-4">
      <h3 className="font-medium mb-2">✅ System Status:</h3>
      <ul className="text-sm text-green-700 space-y-1">
        <li>• Formspree endpoint configured: https://formspree.io/f/myzjjlvn</li>
        <li>• Notification bundling active (sends every 2 hours)</li>
        <li>• Ready to send job recommendations, file uploads, messages, and task assignments</li>
        <li>• Test function available to verify email delivery</li>
      </ul>
    </div>
  );
};

export default FormspreeSystemStatus;
