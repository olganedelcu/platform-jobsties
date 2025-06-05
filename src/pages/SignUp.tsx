
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'MENTEE' as 'COACH' | 'MENTEE'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role: 'COACH' | 'MENTEE') => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role
          }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to confirm your account.",
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to create account',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-4 text-center bg-white rounded-t-lg px-6 py-8">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/b3a57fab-5a88-4c26-96d9-859a520b7897.png" 
                alt="JobSties Logo" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl text-gray-900">Create an Account</CardTitle>
            <CardDescription className="text-gray-600">Join our community today</CardDescription>
            <div className="h-[2px] bg-gradient-to-r from-indigo-400 to-purple-400 -mx-6"></div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700">Role</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={formData.role === 'MENTEE' ? 'default' : 'outline'}
                    onClick={() => handleRoleChange('MENTEE')}
                    className={`flex-1 ${
                      formData.role === 'MENTEE' 
                        ? 'bg-indigo-600 hover:bg-indigo-700' 
                        : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    Mentee
                  </Button>
                  <Button
                    type="button"
                    variant={formData.role === 'COACH' ? 'default' : 'outline'}
                    onClick={() => handleRoleChange('COACH')}
                    className={`flex-1 ${
                      formData.role === 'COACH' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'border-purple-200 text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    Coach
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="John"
                    className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Doe"
                    className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

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
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
