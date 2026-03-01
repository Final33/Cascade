"use client";

import { useState } from "react";

export default function DebatePricing() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Novice",
      description: "Perfect for beginners starting their debate journey",
      monthlyPrice: 49,
      yearlyPrice: 490,
      features: [
        "4 practice rounds per month",
        "Basic speech analytics",
        "Community forum access",
        "Fundamental skills workshops",
        "Email support",
        "Case template library"
      ],
      cta: "Start Learning",
      popular: false,
      color: "blue"
    },
    {
      name: "Varsity",
      description: "For competitive debaters aiming for circuit success",
      monthlyPrice: 149,
      yearlyPrice: 1490,
      features: [
        "12 practice rounds per month",
        "2 live coaching sessions",
        "Advanced analytics dashboard",
        "Judge feedback system",
        "Tournament prep workshops",
        "Priority support",
        "Custom case development",
        "Cross-ex masterclasses"
      ],
      cta: "Level Up",
      popular: true,
      color: "green"
    },
    {
      name: "Elite",
      description: "For serious competitors targeting TOC and nationals",
      monthlyPrice: 299,
      yearlyPrice: 2990,
      features: [
        "Unlimited practice rounds",
        "Weekly 1-on-1 coaching",
        "TOC champion mentorship",
        "Real judge practice sessions",
        "Custom tournament prep",
        "24/7 priority support",
        "Advanced argument mapping",
        "Exclusive circuit workshops",
        "Scholarship guidance",
        "College admissions support"
      ],
      cta: "Go Elite",
      popular: false,
      color: "purple"
    }
  ];

  const addOns = [
    {
      name: "Extra Coaching Sessions",
      price: "$75/session",
      description: "Additional 1-on-1 coaching with expert coaches"
    },
    {
      name: "Tournament Bootcamp",
      price: "$199/weekend",
      description: "Intensive prep for major tournaments"
    },
    {
      name: "Judge Practice Package",
      price: "$149/month",
      description: "5 additional rounds with real circuit judges"
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm px-6 py-3 text-sm font-medium text-slate-300 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            30-Day Money-Back Guarantee
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Invest in Your
            <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Debate Future
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Choose the coaching plan that matches your tournament goals. From first-time breakers to TOC champions.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-white text-blue-600 shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingCycle === "yearly"
                  ? "bg-white text-blue-600 shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular
                  ? "border-green-500 shadow-xl"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-5xl font-black text-gray-900">
                    ${billingCycle === "monthly" ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12)}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{billingCycle === "monthly" ? "month" : "month"}
                  </span>
                  {billingCycle === "yearly" && (
                    <div className="text-sm text-green-600 font-semibold mt-1">
                      Billed annually (${plan.yearlyPrice})
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                  plan.popular
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-[0_4px_0_0_rgba(22,101,52,0.8)]"
                    : "bg-gray-900 hover:bg-gray-800 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.3)]"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="bg-gray-50 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Boost Your Training
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">{addon.name}</h4>
                <div className="text-2xl font-black text-blue-600 mb-3">{addon.price}</div>
                <p className="text-gray-600 text-sm">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-800 mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            30-day money-back guarantee on all plans
          </div>
          <div>
            <a
              href="/get-started"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-green-600 hover:bg-green-700 rounded-2xl shadow-[0_4px_0_0_rgba(22,101,52,0.8)] hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              Start Your Free Trial
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
