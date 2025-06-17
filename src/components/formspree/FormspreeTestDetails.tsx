
import React from 'react';

const FormspreeTestDetails = () => {
  return (
    <div className="border-t pt-4">
      <h3 className="font-medium mb-2">📧 Test Email Details:</h3>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• Test email will be sent to: olga@jobsties.com</li>
        <li>• Will include sample job recommendation, message, and task assignment</li>
        <li>• Demonstrates the bundled notification format</li>
        <li>• Should arrive within a few minutes if Formspree is working correctly</li>
      </ul>
    </div>
  );
};

export default FormspreeTestDetails;
