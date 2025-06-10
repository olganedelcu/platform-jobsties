
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ShowcaseTestimonialsProps {
  currentStep: number;
}

const ShowcaseTestimonials = ({ currentStep }: ShowcaseTestimonialsProps) => {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Software Engineer",
      content: "I never thought I could land a tech job in Germany. The team helped me turn my uncertainty into multiple offers!",
      location: "Berlin"
    },
    {
      name: "Ahmed K.",
      role: "Marketing Manager",
      content: "The 24/7 support was incredible. They guided me through every step and I got my dream job in just 3 months.",
      location: "Munich"
    },
    {
      name: "Maria L.",
      role: "Data Analyst",
      content: "From resume optimization to interview prep, they made the impossible possible. Now I'm thriving in my career!",
      location: "Hamburg"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          currentStep >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hear from Our Happy Mentees!
          </h2>
          <p className="text-xl text-gray-600">
            See how we've helped them turn uncertainty into offers and build careers they never thought possible in Germany.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className={`transition-all duration-500 ${
              currentStep >= 9 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: `${index * 150}ms` }}>
              <CardContent className="p-6">
                <div className="mb-4">
                  <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseTestimonials;
