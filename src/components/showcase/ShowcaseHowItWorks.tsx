
import React from 'react';

const ShowcaseHowItWorks = () => {
  const steps = [
    { step: 1, title: "Sign Up & Get Matched", description: "Create your profile and get matched with an expert coach specialized in the German job market." },
    { step: 2, title: "CV Optimization & Strategy", description: "Work with your coach to optimize your CV and develop a targeted job search strategy for Germany." },
    { step: 3, title: "Interview Preparation", description: "Get prepared for German-style interviews with our guaranteed interview assurance program." },
    { step: 4, title: "Land Your Dream Job", description: "Celebrate your success with our 80% success rate and continue growing with ongoing support." }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Path to Success in Germany
          </h2>
          <p className="text-xl text-gray-600">
            Follow our proven 4-step process to land your dream job
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((item, index) => (
            <div key={index} className="flex items-center gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {item.step}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseHowItWorks;
