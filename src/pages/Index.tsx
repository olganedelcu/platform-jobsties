
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Welcome!
        </h1>
        
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
