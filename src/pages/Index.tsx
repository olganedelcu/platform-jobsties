
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-8 p-8">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/b3a57fab-5a88-4c26-96d9-859a520b7897.png" 
            alt="JobSties Logo" 
            className="h-24 w-auto"
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to JobSties
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Connect with mentors and coaches to accelerate your career growth. 
          Join our platform to find guidance, share knowledge, and build meaningful professional relationships.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
          >
            Get Started
          </Button>
          
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-8 py-3 text-lg"
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
