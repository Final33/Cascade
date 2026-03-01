"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [clickedElements, setClickedElements] = useState<Set<number>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleElementClick = (id: number) => {
    setClickedElements(prev => new Set([...Array.from(prev), id]));
    setTimeout(() => {
      setClickedElements(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(id);
        return newSet;
      });
    }, 1000);
  };

  const staticElements = [
    { id: 1, type: 'calc', x: '6%', y: '8%', rotation: -15, scale: 0.85, opacity: 0.28 },
    { id: 2, type: 'physics', x: '94%', y: '12%', rotation: 12, scale: 0.9, opacity: 0.32 },
    { id: 3, type: 'stats', x: '18%', y: '22%', rotation: 18, scale: 0.75, opacity: 0.26 },
    { id: 4, type: 'chemistry', x: '85%', y: '28%', rotation: -10, scale: 0.8, opacity: 0.3 },
    { id: 5, type: 'cs', x: '3%', y: '42%', rotation: -22, scale: 0.7, opacity: 0.24 },
    { id: 6, type: 'history', x: '96%', y: '48%', rotation: 8, scale: 0.85, opacity: 0.28 },
    { id: 7, type: 'bio', x: '12%', y: '65%', rotation: 25, scale: 0.8, opacity: 0.3 },
    { id: 8, type: 'book', x: '88%', y: '72%', rotation: -18, scale: 0.75, opacity: 0.26 },
    { id: 9, type: 'chemistry', x: '25%', y: '88%', rotation: 15, scale: 0.65, opacity: 0.22 },
    { id: 10, type: 'calc', x: '75%', y: '92%', rotation: -12, scale: 0.7, opacity: 0.24 },
  ];

  const renderElement = (element: any) => {
    const isClicked = clickedElements.has(element.id);
    
    switch (element.type) {
      case 'calc':
        return (
          <div className={`relative w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-2xl cursor-pointer transition-all duration-700 border-2 border-blue-400/30 ${isClicked ? 'scale-150 rotate-12 shadow-blue-500/50' : 'hover:scale-110 hover:shadow-blue-500/30'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            <span className="relative z-10 font-serif">∫</span>
            <span className="relative z-10 text-sm ml-1">dx</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        );
      case 'physics':
        return (
          <div className={`relative w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-2xl cursor-pointer transition-all duration-700 border-2 border-emerald-400/30 ${isClicked ? 'scale-150 -rotate-12 shadow-emerald-500/50' : 'hover:scale-110 hover:shadow-emerald-500/30'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            <div className="relative z-10 text-center">
              <div className="text-xs">F=ma</div>
              <div className="text-[10px] opacity-80">⚡</div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        );
      case 'chemistry':
        return (
          <div className={`relative w-16 h-16 bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 rounded-2xl flex items-center justify-center text-white font-bold shadow-2xl cursor-pointer transition-all duration-700 border-2 border-purple-400/30 ${isClicked ? 'scale-150 rotate-45 shadow-purple-500/50' : 'hover:scale-110 hover:shadow-purple-500/30'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            <div className="relative z-10 text-center">
              <div className="text-sm">H₂O</div>
              <div className="text-[10px] opacity-80">🧪</div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        );
      case 'book':
        return (
          <div className={`relative w-14 h-16 bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700 rounded-lg flex flex-col items-center justify-center text-white shadow-2xl cursor-pointer transition-all duration-700 border-2 border-orange-400/30 ${isClicked ? 'scale-150 -rotate-45 shadow-orange-500/50' : 'hover:scale-110 hover:shadow-orange-500/30'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
            <div className="relative z-10 w-10 h-12 bg-gradient-to-r from-orange-300 to-orange-400 rounded-sm flex flex-col justify-between p-1">
              <div className="w-full h-0.5 bg-orange-600 rounded"></div>
              <div className="w-full h-0.5 bg-orange-600 rounded"></div>
              <div className="w-full h-0.5 bg-orange-600 rounded"></div>
              <div className="w-full h-0.5 bg-orange-600 rounded"></div>
              <div className="text-[8px] text-orange-800 font-bold text-center">AP</div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        );
      case 'stats':
        return (
          <div className={`relative w-16 h-16 bg-gradient-to-br from-cyan-500 via-teal-600 to-cyan-700 rounded-2xl flex items-center justify-center text-white font-bold shadow-2xl cursor-pointer transition-all duration-700 border-2 border-cyan-400/30 ${isClicked ? 'scale-150 rotate-90 shadow-cyan-500/50' : 'hover:scale-110 hover:shadow-cyan-500/30'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            <div className="relative z-10 text-center">
              <div className="text-sm">σ²</div>
              <div className="text-[10px] opacity-80">📊</div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        );
      case 'cs':
        return (
          <div className={`relative w-16 h-16 bg-gradient-to-br from-slate-700 via-gray-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer transition-all duration-700 border-2 border-slate-600/30 ${isClicked ? 'scale-150 -rotate-90 shadow-slate-500/50' : 'hover:scale-110 hover:shadow-slate-500/30'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
            <div className="relative z-10 text-center">
              <div className="text-green-400 font-mono text-sm">{'</>'}</div>
              <div className="text-green-300 text-[10px] opacity-80">💻</div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        );
      case 'history':
        return (
          <div className={`relative w-16 h-16 bg-gradient-to-br from-red-500 via-rose-600 to-red-700 rounded-2xl flex items-center justify-center text-white font-bold shadow-2xl cursor-pointer transition-all duration-700 border-2 border-red-400/30 ${isClicked ? 'scale-150 rotate-180 shadow-red-500/50' : 'hover:scale-110 hover:shadow-red-500/30'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            <div className="relative z-10 text-center">
              <div className="text-sm">1776</div>
              <div className="text-[10px] opacity-80">🏛️</div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        );
      case 'bio':
        return (
          <div className={`relative w-16 h-16 bg-gradient-to-br from-lime-500 via-green-500 to-lime-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-2xl cursor-pointer transition-all duration-700 border-2 border-lime-400/30 ${isClicked ? 'scale-150 rotate-45 shadow-lime-500/50' : 'hover:scale-110 hover:shadow-lime-500/30'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            <div className="relative z-10 text-center">
              <div className="text-sm">DNA</div>
              <div className="text-[10px] opacity-80">🧬</div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {mounted && staticElements.map((element) => (
        <div
          key={element.id}
          className="absolute z-0 hidden sm:block pointer-events-none"
          style={{
            left: element.x,
            top: element.y,
            opacity: element.opacity,
            transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
          }}
        >
          {renderElement(element)}
        </div>
      ))}
      
      {mounted && (
        <div className="sm:hidden">
          <div
            className="absolute z-0 pointer-events-none"
            style={{ 
              left: '4%', 
              top: '8%', 
              opacity: 0.22,
              transform: 'rotate(-18deg) scale(0.6)'
            }}
          >
            {renderElement({ id: 1, type: 'calc' })}
          </div>
          <div
            className="absolute z-0 pointer-events-none"
            style={{ 
              left: '88%', 
              top: '15%', 
              opacity: 0.25,
              transform: 'rotate(22deg) scale(0.55)'
            }}
          >
            {renderElement({ id: 2, type: 'physics' })}
          </div>
          <div
            className="absolute z-0 pointer-events-none"
            style={{ 
              left: '2%', 
              top: '45%', 
              opacity: 0.18,
              transform: 'rotate(-25deg) scale(0.5)'
            }}
          >
            {renderElement({ id: 3, type: 'cs' })}
          </div>
          <div
            className="absolute z-0 pointer-events-none"
            style={{ 
              left: '92%', 
              top: '52%', 
              opacity: 0.2,
              transform: 'rotate(15deg) scale(0.52)'
            }}
          >
            {renderElement({ id: 4, type: 'stats' })}
          </div>
          <div
            className="absolute z-0 pointer-events-none"
            style={{ 
              left: '8%', 
              top: '88%', 
              opacity: 0.2,
              transform: 'rotate(-12deg) scale(0.48)'
            }}
          >
            {renderElement({ id: 5, type: 'chemistry' })}
          </div>
          <div
            className="absolute z-0 pointer-events-none"
            style={{ 
              left: '85%', 
              top: '92%', 
              opacity: 0.22,
              transform: 'rotate(20deg) scale(0.5)'
            }}
          >
            {renderElement({ id: 6, type: 'book' })}
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/15 via-transparent to-green-50/10" />
 
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-300/60 bg-white/90 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-gray-800">
            built with ❤️ by perfect scorers   
          </div>

          <h1 className="mt-10 text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
            <span className="block text-gray-800 font-black">AP Exam's?</span>
            <div className="block relative overflow-hidden">
              <span className="inline-block font-black text-blue-600">
                Handled.
              </span>
            </div>
          </h1>

          <div className="mt-6 max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed">
             personalized cram & studying platform + 1-1 tutoring :)
            </p>
          </div>

          <div className="mt-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link
                href="/dashboard/home"
                className="group inline-flex items-center justify-center px-8 py-3.5 text-lg font-bold text-white bg-green-600 hover:bg-green-700 rounded-2xl shadow-[0_4px_0_0_rgba(22,101,52,0.8)] hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1 min-w-[200px]"
              >
                <span className="flex items-center gap-2">
                  get started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <a
                href="https://discord.gg/Zwg47nxxcG"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-[0_4px_0_0_rgba(156,163,175,0.6)] hover:bg-white hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                free tutoring
              </a>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full border-3 border-white ${i % 2 === 0 ? 'bg-blue-600' : 'bg-green-600'}`} />
                ))}
              </div>
              <span className="text-base text-gray-700 ml-1 font-medium">Trusted by 10,000+ students</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}