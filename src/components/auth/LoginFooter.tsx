
import React from 'react';

const LoginFooter = () => {
  return (
    <div className="text-center mt-6">
      <p className="text-sm text-gray-600">
        Don't have an account?{' '}Contact{' '}
        <a 
          href="mailto:olga@jobsties.com" 
          className="text-indigo-600 hover:text-indigo-500 font-medium underline"
        >
          olga@jobsties.com
        </a>
      </p>
    </div>
  );
};

export default LoginFooter;
