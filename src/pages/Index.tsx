
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
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
          Speed Up Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Jobsearch</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Let's get you hired! Connect, track, schedule your sessions here
        </p>
        
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
