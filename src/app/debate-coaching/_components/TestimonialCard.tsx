"use client";

import Image from "next/image";
import { useState } from "react";

type TestimonialCardProps = {
  name: string;
  role: string;
  image: string;
  quote: string;
  achievement: string;
  beforeAfter?: {
    before: string;
    after: string;
  };
};

const TestimonialCard = ({ 
  name, 
  role, 
  image, 
  quote, 
  achievement,
  beforeAfter 
}: TestimonialCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group relative h-80 w-full cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative h-full w-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <Image
              src={image}
              alt={name}
              width={60}
              height={60}
              className="rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{name}</h4>
              <p className="text-sm text-gray-600">{role}</p>
            </div>
          </div>
          
          <blockquote className="mt-4 text-gray-700">
            "{quote}"
          </blockquote>
          
          <div className="mt-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-3">
            <p className="text-sm font-medium text-indigo-900">🏆 {achievement}</p>
          </div>
          
          {beforeAfter && (
            <p className="mt-3 text-xs text-gray-500 text-center">
              Click to see transformation →
            </p>
          )}
        </div>

        {/* Back */}
        {beforeAfter && (
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-lg">
            <h4 className="mb-4 text-center font-semibold text-gray-900">Transformation</h4>
            
            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 p-3 border-l-4 border-red-400">
                <p className="text-sm font-medium text-red-800">Before:</p>
                <p className="text-sm text-red-700">{beforeAfter.before}</p>
              </div>
              
              <div className="rounded-lg bg-green-50 p-3 border-l-4 border-green-400">
                <p className="text-sm font-medium text-green-800">After:</p>
                <p className="text-sm text-green-700">{beforeAfter.after}</p>
              </div>
            </div>
            
            <p className="mt-4 text-xs text-gray-500 text-center">
              ← Click to go back
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialCard;
