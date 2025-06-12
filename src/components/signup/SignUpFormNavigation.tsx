
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpFormNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-6">
      <p className="text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Sign in
        </button>
      </p>
      <p className="text-sm text-gray-600 mt-2">
        Are you a coach?{' '}
        <button
          type="button"
          onClick={() => navigate('/coach-signup')}
          className="text-purple-600 hover:text-purple-500 font-medium"
        >
          Sign up as coach
        </button>
      </p>
    </div>
  );
};

export default SignUpFormNavigation;
