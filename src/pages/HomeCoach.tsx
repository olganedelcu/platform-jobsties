
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomeCoach = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-8 p-8">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/09eb05af-ad26-4901-aafd-0d84888e4010.png" 
            alt="Jobsties Platform Logo" 
            className="h-20 w-auto"
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Welcome <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Coaches</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join our platform to mentor and guide job seekers on their career journey
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/coach-signup')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2"
          >
            Register as Coach
          </Button>
          
          <Button
            onClick={() => navigate('/coach-login')}
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50 px-6 py-2"
          >
            Coach Sign In
          </Button>
        </div>

        <div className="pt-8 border-t border-gray-200 mt-12">
          <p className="text-lg font-medium text-gray-900 mb-4">Looking for career guidance?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2"
            >
              Get Started as Mentee
            </Button>
            
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-6 py-2"
            >
              Mentee Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCoach;
