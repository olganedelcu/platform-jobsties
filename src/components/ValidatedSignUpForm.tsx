
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useSignUpValidation, type SignUpFormData } from '@/hooks/useSignUpValidation';
import { createMenteeAccount } from '@/services/signUpService';
import SignUpFormFields from '@/components/signup/SignUpFormFields';
import SignUpFormNavigation from '@/components/signup/SignUpFormNavigation';

const ValidatedSignUpForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { executeWithErrorHandling } = useErrorHandler();

  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    handleBlur,
    handleSubmit
  } = useSignUpValidation();

  const onSubmit = async (formData: SignUpFormData) => {
    const success = await executeWithErrorHandling(
      async () => {
        const result = await createMenteeAccount(formData);
        
        if (result) {
          // Always show the email confirmation message since Supabase sends confirmation emails by default
          toast({
            title: "Account Created Successfully!",
            description: "Please check your email and click the confirmation link to complete your registration. Don't forget to check your spam folder!",
          });
          
          navigate('/login');
          return true;
        }
        
        return false;
      },
      { 
        component: 'ValidatedSignUpForm', 
        action: 'signup' 
      }
    );

    if (!success) {
      toast({
        title: "Signup Failed",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(onSubmit);
    }} className="space-y-4">
      <SignUpFormFields
        values={values}
        errors={errors}
        touched={touched}
        setValue={setValue}
        handleBlur={handleBlur}
      />

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? 'Creating Account...' : 'Create Mentee Account'}
      </Button>

      <SignUpFormNavigation />
    </form>
  );
};

export default ValidatedSignUpForm;
