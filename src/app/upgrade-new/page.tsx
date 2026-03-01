"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";

export default function UpgradeNewPage() {
  const [inView, setInView] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
  const [loading, setLoading] = useState(false);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  const basicId = process.env.NEXT_PUBLIC_STRIPE_BASIC_PRODUCTID;
  const proId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRODUCTID;

  async function handleSubscribe(plan: "monthly" | "yearly") {
    setLoading(true);
    const stripe = await stripePromise;

    const supabase = createSupabaseBrowserClient();
    const session = await supabase.auth.getSession();
    
    if (!session.data.session?.user.id) {
      setLoading(false);
      return;
    }
    
    const { data: data1, error } = await supabase
      .from("users")
      .select("*")
      .eq("uid", session.data.session.user.id);

    if (!data1 || data1.length === 0) {
      setLoading(false);
      return;
    }

    const uid = (data1[0] as any).uid;
    const email = (data1[0] as any).email;
    const trial = false;

    let priceId;
    if (plan === "monthly") {
      priceId = basicId;
    } else {
      priceId = proId;
    }

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId, selectedPlan: plan, uid, email, trial }),
    });

    const data = await response.json();

    if (data.sessionId) {
      stripe?.redirectToCheckout({ sessionId: data.sessionId });
    }
    setLoading(false);
  }

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

  const periods = ["Yearly", "Monthly", "Lifetime"];

  const plans = selectedPeriod === "Lifetime" ? [
    {
      name: "Prepsy Lifetime",
      header: "Get all 5s for the rest of high school", 
      headerColor: "bg-gradient-to-r from-black to-red-900",
      pricing: {
        "Lifetime": { price: 1000, originalPrice: 4000, period: "4 years", savings: "Save $1000s in college courses!" }
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
        "Monthly": { price: 29.99, originalPrice: 50, period: "month", savings: null }
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
        "Monthly": { price: 49.99, originalPrice: 100, period: "month", savings: null }
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
        "Monthly": { price: 99.99, originalPrice: 200, period: "month", savings: null }
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
    <div className="min-h-screen bg-gray-50">
      {/* Landing Page Style Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-black text-gray-900 tracking-tight">
                <span className="text-green-600">prep</span><span className="text-blue-600">sy :)</span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/mission" className="text-gray-600 hover:text-gray-900 font-medium">
                Mission
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push("/dashboard/home")}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

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
                        onClick={() => handleSubscribe("monthly")}
                        disabled={loading}
                        className={`inline-block text-center py-2.5 px-20 rounded-3xl font-bold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.2)] ${plan.buttonColor}`}
                      >
                        {loading ? "Loading..." : plan.cta}
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
    </div>
  );
}
