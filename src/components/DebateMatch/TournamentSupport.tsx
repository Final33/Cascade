"use client";

import { useState } from "react";

export default function TournamentSupport() {
  const [activeTab, setActiveTab] = useState("hosting");

  const services = {
    hosting: [
      {
        title: "Complete Tournament Management",
        description: "End-to-end tournament organization from registration to awards ceremony.",
        features: ["Registration platform", "Bracket management", "Judge coordination", "Live results"],
        price: "Starting at $2,500",
        duration: "Full weekend",
        icon: "🏆"
      },
      {
        title: "Judge Pool Coordination",
        description: "Professional judge recruitment and management for your tournament.",
        features: ["Judge recruitment", "Training sessions", "Schedule coordination", "Payment processing"],
        price: "Starting at $1,200",
        duration: "Per tournament",
        icon: "👨‍⚖️"
      },
      {
        title: "Technology Support",
        description: "Complete tech stack for modern tournament management.",
        features: ["Tabroom setup", "Live streaming", "Digital ballots", "Results portal"],
        price: "Starting at $800",
        duration: "Full event",
        icon: "💻"
      }
    ],
    coaching: [
      {
        title: "Team Tournament Prep",
        description: "Intensive preparation for specific tournaments with expert coaches.",
        features: ["Strategy sessions", "Mock rounds", "Case review", "Performance analysis"],
        price: "Starting at $400",
        duration: "Per session",
        icon: "🎯"
      },
      {
        title: "Tournament Coaching",
        description: "On-site coaching support during tournaments.",
        features: ["Round preparation", "Real-time feedback", "Strategy adjustments", "Moral support"],
        price: "Starting at $600",
        duration: "Per day",
        icon: "📋"
      },
      {
        title: "Post-Tournament Analysis",
        description: "Comprehensive review and improvement planning after tournaments.",
        features: ["Performance review", "Improvement plan", "Next tournament prep", "Skill development"],
        price: "Starting at $200",
        duration: "2-hour session",
        icon: "📊"
      }
    ],
    logistics: [
      {
        title: "Venue & Logistics",
        description: "Complete venue management and logistical coordination.",
        features: ["Venue booking", "Room setup", "Equipment rental", "Catering coordination"],
        price: "Starting at $1,500",
        duration: "Full event",
        icon: "🏢"
      },
      {
        title: "Travel Coordination",
        description: "Group travel planning and coordination for tournament attendance.",
        features: ["Transportation booking", "Hotel reservations", "Group discounts", "Itinerary planning"],
        price: "Starting at $300",
        duration: "Per trip",
        icon: "✈️"
      },
      {
        title: "Equipment & Materials",
        description: "Tournament supplies and equipment rental services.",
        features: ["Timer systems", "Microphones", "Podiums", "Signage & materials"],
        price: "Starting at $400",
        duration: "Per event",
        icon: "🎤"
      }
    ]
  };

  const tabs = [
    { id: "hosting", label: "Tournament Hosting", icon: "🏆" },
    { id: "coaching", label: "Team Support", icon: "👥" },
    { id: "logistics", label: "Logistics", icon: "📦" }
  ];

  const testimonials = [
    {
      quote: "DebateMatch handled everything for our invitational. 200+ teams, flawless execution, and the judges were incredible. Best tournament we've ever hosted.",
      author: "Sarah Johnson",
      title: "Tournament Director, Lincoln High School",
      event: "Lincoln Invitational 2024"
    },
    {
      quote: "The coaching support during nationals was game-changing. Having an expert coach trackside made all the difference in our team's performance.",
      author: "Michael Chen",
      title: "Head Coach, Roosevelt Debate Team",
      event: "NSDA Nationals 2024"
    },
    {
      quote: "From venue setup to judge coordination, everything was seamless. Our students could focus on debating while DebateMatch handled the rest.",
      author: "Dr. Amanda Rodriguez",
      title: "Debate Program Director",
      event: "State Championship 2024"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Tournament <span className="text-[#01459f]">Support</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tournament services from hosting to coaching support.
          </p>
        </div>

        {/* Service Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-xl p-1 border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#01459f] text-white shadow-md"
                    : "text-gray-600 hover:text-[#01459f]"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services[activeTab as keyof typeof services].map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#01459f]/30 hover:shadow-lg transition-all duration-200"
            >
              {/* Service Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#01459f] to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <div className="text-gray-500 text-xs font-medium mb-3">What's Included</div>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700 text-sm">
                      <div className="w-2 h-2 bg-[#01459f] rounded-full mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & Duration */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-gray-500 text-xs font-medium mb-1">Duration</div>
                  <div className="text-gray-900 font-semibold text-sm">{service.duration}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-xs font-medium mb-1">Price</div>
                  <div className="text-[#01459f] font-bold text-lg">{service.price}</div>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full py-3 px-6 bg-[#01459f] hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg">
                Get Quote
              </button>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How Tournament Support Works
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Consultation",
                description: "Discuss your tournament needs and get a custom quote.",
                icon: "💬"
              },
              {
                step: "02",
                title: "Planning",
                description: "Detailed planning and coordination with our expert team.",
                icon: "📋"
              },
              {
                step: "03",
                title: "Execution",
                description: "Professional execution of all tournament services.",
                icon: "⚡"
              },
              {
                step: "04",
                title: "Follow-up",
                description: "Post-event analysis and feedback for future improvements.",
                icon: "📊"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#01459f] to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {item.step}
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h4>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Tournament Success Stories
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#01459f]/30 transition-colors duration-200"
              >
                <blockquote className="text-gray-700 text-sm leading-relaxed mb-4">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#01459f] to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {testimonial.title}
                    </div>
                    <div className="text-[#01459f] text-xs font-semibold">
                      {testimonial.event}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-[#01459f]/5 to-blue-100/50 border border-[#01459f]/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Host Your Best Tournament?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
              Let our experts handle the logistics while you focus on creating an amazing debate experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/get-started"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-[#01459f] hover:bg-blue-700 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Get Custom Quote
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-[#01459f] bg-white hover:bg-gray-50 border-2 border-[#01459f] rounded-xl transition-colors duration-200"
              >
                Schedule Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
