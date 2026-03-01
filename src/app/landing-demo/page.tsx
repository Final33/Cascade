"use client";

import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';

const LandingDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      {/* How It Works Section Placeholder */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This is a placeholder section for the "How It Works" content. 
            The Hero section's "How It Works" button will smoothly scroll to this section.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingDemo;
