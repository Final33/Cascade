"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { loadStripe } from "@stripe/stripe-js";
import { redirect, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "../dashboard/settings/profile-form";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/Chatbot/Components/Spinner";
import { PricingOnboarding } from "@/components/Dashboard/Pricing/PricingOnboarding";

import { ChevronLeft, ChevronRight, X } from "lucide-react";

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to Prepsy!",
    description: "We're excited to have you here. Let's get you started on your journey to ace the SAT & ACT with all the tools you need in one place!",
    illustration: "🦉",
    showForm: false
  },
  {
    id: 2,
    title: "Simulate the Real Exam",
    description: "Solve problems with all the same tools you'll be given on the DSAT & ACT. We've partnered with Desmos to provide an authentic testing experience.",
    illustration: "📊",
    showForm: false
  },
  {
    id: 3,
    title: "Extensive Question Bank",
    description: "Practice with 1,000+ questions in DSAT format, written by top-scoring tutors and prep academies. Track your progress as you go!",
    illustration: "📚",
    showForm: false
  },
  {
    id: 4,
    title: "How did you hear about us?",
    description: "Help us understand how you discovered Prepsy so we can improve our outreach!",
    illustration: "📢",
    showForm: true,
    formType: "discovery"
  },
  {
    id: 5,
    title: "What's your role?",
    description: "This information helps us understand your background and what you're interested in.",
    illustration: "👤",
    showForm: true,
    formType: "role"
  },
  {
    id: 6,
    title: "Select your AP classes",
    description: "Choose the AP classes you're taking or planning to take so we can personalize your experience.",
    illustration: "🎓",
    showForm: true,
    formType: "classes"
  }
];

export default function OnboardingPage() {
  const [userData, setUserData] = useState<any>(null);
  const [isPremiumLoading, setIsPremiumLoading] = useState(false);
  const [isFreeLoading, setIsFreeLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    discovery: "",
    role: "",
    apClasses: [] as string[]
  });

  const totalSteps = onboardingSteps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 150);
    } else if (currentStep === totalSteps - 1) {
      handleFormSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleSkip = () => {
    handleFreeClick();
  };

  const handleFormSubmit = async () => {
    // Save form data to database when completing the onboarding
    if (currentStep === totalSteps - 1) {
      setIsFreeLoading(true);
      const session = await createSupabaseBrowserClient().auth.getSession();

      if (session.data.session?.user.id) {
        await (supabase
          .from("users") as any)
          .update({
            onboarded: true,
            plan: "free",
            apclasses: formData.apClasses,
            discovery_source: formData.discovery,
            user_role: formData.role,
          })
          .eq("uid", session.data.session.user.id);
      }

      // Check if user came from pricing page
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect_to');
      
      if (redirectTo === 'upgrade-new') {
        router.push("/upgrade-new");
        return;
      }

      router.push("/dashboard/home");
    } else {
      handleNext();
    }
  };

  async function submitProfileForm() {
    handleNext();
  }

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  const basicId = process.env.NEXT_PUBLIC_STRIPE_BASIC_PRODUCTID;
  const proId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRODUCTID;

  async function handleFreeClick() {
    setIsFreeLoading(true);
    const session = await createSupabaseBrowserClient().auth.getSession();

    if (session.data.session?.user.id) {
      await (supabase
        .from("users") as any)
      .update({
        onboarded: true,
        plan: "free",
          apclasses: [],
      })
        .eq("uid", session.data.session.user.id);
    }

    // Check if user came from pricing page
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get('redirect_to');
    
    if (redirectTo === 'upgrade-new') {
      router.push("/upgrade-new");
      return;
    }

    router.push("/dashboard/home");
  }

  async function handleSubscribe(plan: "monthly" | "yearly") {
    setIsPremiumLoading(true);
    const stripe = await stripePromise;

    if (!stripe) return;

    const supabase = createSupabaseBrowserClient();
    const session = await createSupabaseBrowserClient().auth.getSession();
    
    if (!session.data.session?.user.id) return;

    const { data: data1, error } = await supabase
      .from("users")
      .select("*")
      .eq("uid", session.data.session.user.id);

    if (!data1 || data1.length === 0) return;

    const uid = (data1[0] as any).uid;
    const email = (data1[0] as any).email;

    let priceId;
    if (plan === "monthly") {
      priceId = basicId;
    } else {
      priceId = proId;
    }
    const trial = false;

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId, selectedPlan: plan, uid, email, trial }),
    });

    const data = await response.json();

    if (data.sessionId) {
      stripe.redirectToCheckout({ sessionId: data.sessionId });
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  async function getUserData() {
    const session = await supabase.auth.getSession();
    
    if (!session.data.session?.user.id) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("uid", session.data.session.user.id);

    if (data) setUserData(data[0]);
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut().catch(() => {});
    } finally {
      router.push('/auth/logout');
    }
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Skip Button */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Skip
          </Button>
        </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-2xl mx-auto text-center">
          {/* Illustration */}
          <div className={`mb-8 sm:mb-12 transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {(currentStep === 0 || currentStep === 3 || currentStep === 4 || currentStep === 5) && (
              <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center shadow-lg">
                <div className="text-6xl sm:text-8xl">{currentStepData.illustration}</div>
              </div>
            )}
            {currentStep === 1 && (
              <div className="w-64 h-48 sm:w-80 sm:h-64 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center shadow-lg p-6 sm:p-8">
                <div className="w-full h-full bg-white rounded-2xl shadow-inner flex items-center justify-center">
                  <div className="text-3xl sm:text-4xl">{currentStepData.illustration}</div>
                </div>
            </div>
            )}
            {currentStep === 2 && (
              <div className="w-64 h-48 sm:w-80 sm:h-64 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center shadow-lg p-6 sm:p-8">
                <div className="w-full h-full bg-white rounded-2xl shadow-inner flex flex-col items-center justify-center space-y-2">
                  <div className="text-3xl sm:text-4xl">{currentStepData.illustration}</div>
                  <div className="text-xs text-gray-500">Problem List</div>
            </div>
          </div>
        )}
          </div>

          {/* Content */}
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
              {currentStepData.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 leading-relaxed max-w-xl mx-auto px-4">
              {currentStepData.description}
            </p>

            {/* Custom Forms */}
            {currentStepData.showForm && (
              <div className="mb-8 sm:mb-12">
                <div className="max-w-md mx-auto">
                  {currentStepData.formType === "discovery" && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="TikTok, LinkedIn, Reddit, etc."
                        value={formData.discovery}
                        onChange={(e) => setFormData({...formData, discovery: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                      <p className="text-sm text-gray-500 text-center">Feel free to enter multiple sources.</p>
                    </div>
                  )}
                  
                  {currentStepData.formType === "role" && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Student, Teacher, etc."
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                      <p className="text-sm text-gray-500 text-center">This information helps us understand your role and what you are interested in.</p>
                    </div>
                  )}
                  
                                    {currentStepData.formType === "classes" && (
                    <div className="w-full max-w-4xl mx-auto space-y-6">
                      {/* AP Classes Grid */}
                      <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-2xl p-4">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            "AP Art History", "AP Biology", "AP Calculus AB", "AP Calculus BC", 
                            "AP Chemistry", "AP Chinese Language and Culture", "AP Computer Science A", 
                            "AP Computer Science Principles", "AP Economics (Macro)", "AP Economics (Micro)",
                            "AP English Language", "AP English Literature", "AP Environmental Science",
                            "AP European History", "AP French Language", "AP Geography (Human)",
                            "AP German Language", "AP Government (Comparative)", "AP Government (US)",
                            "AP History (US)", "AP History (World)", "AP Italian Language",
                            "AP Japanese Language", "AP Latin", "AP Music Theory",
                            "AP Physics 1", "AP Physics 2", "AP Physics C (E&M)", "AP Physics C (Mechanics)",
                            "AP Psychology", "AP Research", "AP Seminar", "AP Spanish Language",
                            "AP Spanish Literature", "AP Statistics", "AP Studio Art (2D)", 
                            "AP Studio Art (3D)", "AP Studio Art (Drawing)"
                          ].map((className) => (
                            <button
                              key={className}
                              onClick={() => {
                                const isSelected = formData.apClasses.includes(className);
                                if (isSelected) {
                                  setFormData({
                                    ...formData,
                                    apClasses: formData.apClasses.filter(c => c !== className)
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    apClasses: [...formData.apClasses, className]
                                  });
                                }
                              }}
                              className={`p-3 rounded-xl border text-sm transition-all text-left ${
                                formData.apClasses.includes(className)
                                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {className.replace("AP ", "")}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Selection Summary */}
                      {formData.apClasses.length > 0 && (
                        <div className="p-4 bg-blue-50 rounded-2xl">
                          <p className="text-sm text-blue-700 font-medium mb-3">
                            Selected ({formData.apClasses.length}):
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {formData.apClasses.map((className) => (
                              <span
                                key={className}
                                className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-100 text-blue-800 text-sm"
                              >
                                {className.replace("AP ", "")}
                                <button
                      onClick={() => {
                                    setFormData({
                                      ...formData,
                                      apClasses: formData.apClasses.filter(c => c !== className)
                                    });
                                  }}
                                  className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.apClasses.length === 0 && (
                        <p className="text-sm text-gray-500 text-center">Select the AP classes you're taking or planning to take</p>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex items-center justify-between max-w-sm mx-auto pt-4">
                        <Button
                          variant="outline"
                          onClick={handleBack}
                          className="flex items-center space-x-2 px-6 py-3 rounded-full border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back</span>
                        </Button>

                        <Button
                          onClick={handleNext}
                      disabled={isFreeLoading}
                          className="flex items-center space-x-2 px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
                        >
                          <span>Get Started</span>
                          {isFreeLoading ? (
                            <Spinner />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                    </Button>
                  </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-blue-500 w-8'
                  : index < currentStep
                  ? 'bg-blue-300'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Step Counter */}
        <div className="text-sm text-gray-500 mb-8">
          {currentStep + 1} of {totalSteps}
            </div>

        {/* Navigation - Hidden for classes step since it has its own buttons */}
        {currentStepData.formType !== "classes" && (
          <div className="flex items-center justify-between w-full max-w-xs sm:max-w-sm mx-auto px-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={isFreeLoading}
              className="flex items-center space-x-1 sm:space-x-2 px-6 sm:px-8 py-2 sm:py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 text-sm sm:text-base"
            >
              <span>
                {currentStep === totalSteps - 1 ? 'Get Started' : 'Next'}
              </span>
              {isFreeLoading ? (
                <Spinner />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
