"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const [inView, setInView] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
  const [userAuthState, setUserAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("pricing");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Check user authentication state
    const checkAuthState = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserAuthState('authenticated');
      } else {
        setUserAuthState('unauthenticated');
      }
    };

    checkAuthState();
  }, []);

  const handlePricingClick = () => {
    if (userAuthState === 'authenticated') {
      // User is logged in - direct to upgrade page
      router.push('/upgrade-new');
    } else {
      // User is not logged in - redirect to dashboard which will show integrated login
      // Store the intended destination in sessionStorage for after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pricing_redirect', '/upgrade-new');
      }
      router.push('/dashboard/home');
    }
  };

  const periods = ["Yearly", "Monthly", "Lifetime"];

  const plans = selectedPeriod === "Lifetime" ? [
    {
      name: "Prepsy Lifetime",
      header: "Get all 5s for the rest of high school", 
      headerColor: "bg-gradient-to-r from-black to-red-900",
      pricing: {
        "Lifetime": { price: 999, originalPrice: 4000, period: "4 years", savings: "Save $1000s in college courses!" }
      },
      features: [
        "unlimited AP subjects",
        "everything in all plans combined",
        "1-on-1 personalized tutoring",
        "24/7 tutor messaging support",
        "advanced AI tutor - unlimited",
        "priority grading & feedback",
        "exclusive study resources",
        "personal support & mentoring",
        "save thousands on AP prep courses",
        "guarantee all 5s or your money back"
      ],
      lifetimeFeatures: [
        "unlimited AP subjects",
        "everything in all plans combined",
        "1-on-1 personalized tutoring",
        "24/7 tutor messaging support",
        "advanced AI tutor - unlimited",
        "priority grading & feedback",
        "exclusive study resources",
        "personal support & mentoring",
        "save thousands on AP prep courses",
        "guarantee all 5s or your money back"
      ],
      cta: "Choose Plan",
      buttonColor: "bg-gradient-to-r from-black to-red-900 hover:from-gray-900 hover:to-red-800 text-white shadow-[0_4px_0_0_rgba(127,29,29,0.8)]",
      popular: false
    }
  ] : [
    {
      name: "Prepsy Plus",
      header: "Perfect for 1 AP Class",
      headerColor: "bg-blue-500",
      pricing: {
        "Yearly": { price: 199, originalPrice: 360, period: "year", savings: "45%" },
        "Monthly": { price: 29, originalPrice: 50, period: "month", savings: null }
      },
      features: [
        "access to 1 AP subject of your choice",
        "1,000+ practice problems",
        "comprehensive study modules", 
        "college Board qbank tracker",
        "custom study plans",
        "mock exams & explanations",
        "switch subjects once per semester",
        "save thousands on AP prep courses",
        "guarantee 3+ or your money back"
      ],
      lifetimeFeatures: [],
      cta: "Choose Plan",
      buttonColor: "bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_0_0_rgba(29,78,216,0.8)]"
    },
    {
      name: "Prepsy Pro", 
      header: "Ideal for 2-3 AP Classes",
      headerColor: "bg-blue-500",
      pricing: {
        "Yearly": { price: 349, originalPrice: 600, period: "year", savings: "42%" },
        "Monthly": { price: 49, originalPrice: 100, period: "month", savings: null }
      },
      features: [
        "access to 3 AP subjects of your choice",
        "everything in prepsy Plus",
        "live weekly study sessions",
        "advanced AI tutor - 250 sessions", 
        "generate unlimited practice questions",
        "priority community access",
        "switch subjects once per semester",
        "save thousands on AP prep courses",
        "guarantee all 4 or 5s or your money back"
      ],
      lifetimeFeatures: [],
      cta: "Choose Plan",
      buttonColor: "bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_0_0_rgba(29,78,216,0.8)]",
      popular: true
    },
    {
      name: "Prepsy Premium",
      header: "Best for 4+ AP Classes", 
      headerColor: "bg-black",
      pricing: {
        "Yearly": { price: 549, originalPrice: 1200, period: "year", savings: "54%" },
        "Monthly": { price: 99, originalPrice: 200, period: "month", savings: null }
      },
      features: [
        "unlimited AP subjects",
        "everything in prepsy Plus + Pro",
        "1-on-1 personalized tutoring",
        "24/7 tutor messaging support",
        "advanced AI tutor - unlimited",
        "priority grading & feedback",
        "exclusive study resources",
        "save thousands on AP prep courses",
        "guarantee all 4s or 5s or your money back"
      ],
      lifetimeFeatures: [],
      cta: "Choose Plan",
      buttonColor: "bg-black hover:bg-gray-800 text-white shadow-[0_4px_0_0_rgba(55,65,81,0.8)]"
    }
  ];

  return (
    <section id="pricing" className="py-12 bg-gray-50">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            lets get that <span className="text-blue-600">5!</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            it's never been easier to prep for your exams
          </p>
          <div className="flex items-center justify-center gap-2 mb-14">
            {periods.map((period, index) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`relative px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                  selectedPeriod === period
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period === "Yearly" && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    -50%
                  </div>
                )}
                {period}
              </button>
            ))}
          </div>

          {selectedPeriod === "Yearly" && (
            <div className="flex items-center justify-center gap-2 text-green-600 mb-12">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Perfect! A full year of preparation provides comprehensive AP readiness</span>
            </div>
          )}
          {selectedPeriod === "Lifetime" && (
            <div className="flex items-center justify-center gap-2 text-red-600 mb-12">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-bold"> Save $1000s in college courses + <span className="text-red-600">You get all 5s or your money back.</span></span>
            </div>
          )}
        </div>

        <div className={`grid gap-5 w-full mx-auto px-8 ${
          selectedPeriod === "Lifetime" 
            ? "grid-cols-1 max-w-md mx-auto" 
            : "grid-cols-1 md:grid-cols-3"
        }`}>
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className="relative flex flex-col"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className={`bg-white rounded-3xl overflow-hidden relative flex flex-col h-full ${
                plan.name === "Prepsy Lifetime"
                  ? "border-2 border-red-600 shadow-lg shadow-red-900/20"
                  : plan.name === "Prepsy Premium" 
                  ? "border border-black" 
                  : "border border-blue-500"
              }`}>
                <div className={`${plan.headerColor} text-white px-6 py-3 text-center`}>
                  <h3 className="font-bold text-lg">{plan.header}</h3>
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <div className="relative flex justify-center mb-2">
                    <h2 className="text-2xl font-black text-gray-900">{plan.name}</h2>
                    {selectedPeriod === "Yearly" && (plan.pricing as any)[selectedPeriod] && (plan.pricing as any)[selectedPeriod].savings && (
                      <div className="absolute -top-2 -right-6 transform rotate-12 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-bold shadow-sm border border-green-200">
                        Save {(plan.pricing as any)[selectedPeriod].savings}
                      </div>
                    )}
                  </div>

                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2">
                      {(plan.pricing as any)[selectedPeriod] && (plan.pricing as any)[selectedPeriod].originalPrice && (
                        <span className="text-2xl font-black text-gray-400 line-through">${(plan.pricing as any)[selectedPeriod].originalPrice}</span>
                      )}
                      <span className="text-3xl font-black text-gray-900">
                        ${(plan.pricing as any)[selectedPeriod] ? (plan.pricing as any)[selectedPeriod].price : 0}
                      </span>
                      <span className="text-lg font-medium text-gray-600">/{(plan.pricing as any)[selectedPeriod] ? (plan.pricing as any)[selectedPeriod].period : ''}</span>
                    </div>
                  </div>

                  <div className="mb-6 flex justify-center">
                    <button
                      onClick={handlePricingClick}
                      disabled={userAuthState === 'loading'}
                      className={`inline-block text-center py-2.5 px-20 rounded-3xl font-bold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.2)] transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${plan.buttonColor}`}
                    >
                      {userAuthState === 'loading' ? 'Loading...' : plan.cta}
                    </button>
                  </div>

                  <div className="flex-1 mb-6">
                    <ul className="space-y-4">
                      {(selectedPeriod === "Lifetime" ? plan.lifetimeFeatures : plan.features).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className={`text-lg font-medium leading-relaxed ${
                            feature.includes("guarantee") || feature.includes("GUARANTEE") ? "text-red-600 font-bold" : "text-gray-900"
                          }`}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>




                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}


