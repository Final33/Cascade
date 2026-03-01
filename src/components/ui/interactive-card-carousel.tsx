"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import { Star, Trophy, GraduationCap, DollarSign, Sparkles } from 'lucide-react';
import { useCursor } from './interactive-cursor';
import { InteractiveButton } from './interactive-button';

interface Profile {
  id: string;
  name: string;
  image: string;
  badge: {
    text: string;
    icon: React.ReactNode;
    color: string;
  };
  achievement: string;
  rating: number;
  reviews: number;
  specialty: string;
}

const profiles: Profile[] = [
  {
    id: '1',
    name: 'Aarnav T.',
    image: '/Aarnav.png',
    badge: {
      text: 'TOC Champion',
      icon: <Trophy className="w-4 h-4" />,
      color: 'from-yellow-400 to-orange-500'
    },
    achievement: 'National Tournament Champion',
    rating: 5.0,
    reviews: 127,
    specialty: 'Policy Debate'
  },
  {
    id: '2',
    name: 'Henry P.',
    image: '/HenryPan.png',
    badge: {
      text: 'Harvard \'28',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'from-emerald-400 to-teal-500'
    },
    achievement: 'Ivy League Success Story',
    rating: 4.9,
    reviews: 89,
    specialty: 'Lincoln-Douglas'
  },
  {
    id: '3',
    name: 'Pearson M.',
    image: '/Pearson.png',
    badge: {
      text: '$50k Scholar',
      icon: <DollarSign className="w-4 h-4" />,
      color: 'from-purple-400 to-pink-500'
    },
    achievement: 'Full Scholarship Winner',
    rating: 4.8,
    reviews: 156,
    specialty: 'Public Forum'
  },
  {
    id: '4',
    name: 'Savvy R.',
    image: '/Savvy.png',
    badge: {
      text: 'Circuit Star',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'from-orange-400 to-red-500'
    },
    achievement: 'National Circuit Success',
    rating: 4.9,
    reviews: 203,
    specialty: 'Parliamentary'
  }
];

const InteractiveCardCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { setCursorVariant, mousePosition } = useCursor();
  
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(mouseY, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(mouseX, { stiffness: 200, damping: 20 });

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % profiles.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const handleCardMouseEnter = (cardId: string, event: React.MouseEvent) => {
    setHoveredCard(cardId);
    setCursorVariant('card');
    
    const card = cardRefs.current[cardId];
    if (card) {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate tilt based on mouse position
      const rotateXValue = (mousePosition.y - centerY) / rect.height * -10;
      const rotateYValue = (mousePosition.x - centerX) / rect.width * 10;
      
      mouseX.set(rotateYValue);
      mouseY.set(rotateXValue);
    }
  };

  const handleCardMouseMove = (cardId: string, event: React.MouseEvent) => {
    const card = cardRefs.current[cardId];
    if (card && hoveredCard === cardId) {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rotateXValue = (event.clientY - centerY) / rect.height * -8;
      const rotateYValue = (event.clientX - centerX) / rect.width * 8;
      
      mouseX.set(rotateYValue);
      mouseY.set(rotateXValue);
    }
  };

  const handleCardMouseLeave = () => {
    setHoveredCard(null);
    setCursorVariant('default');
    mouseX.set(0);
    mouseY.set(0);
  };

  const currentProfile = profiles[currentIndex];

  return (
    <div 
      className="relative w-full max-w-sm mx-auto perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProfile.id}
          ref={(el) => { cardRefs.current[currentProfile.id] = el; }}
          initial={{ opacity: 0, y: 50, rotateY: -15, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            rotateY: hoveredCard === currentProfile.id ? rotateY.get() : 0, 
            scale: 1,
            rotateX: hoveredCard === currentProfile.id ? rotateX.get() : 0,
          }}
          exit={{ opacity: 0, y: -50, rotateY: 15, scale: 0.9 }}
          transition={{ 
            duration: 0.6, 
            ease: "easeOut",
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className="relative transform-gpu"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
          onMouseEnter={(e) => handleCardMouseEnter(currentProfile.id, e)}
          onMouseMove={(e) => handleCardMouseMove(currentProfile.id, e)}
          onMouseLeave={handleCardMouseLeave}
        >
          {/* Card Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-teal-400/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl"
            animate={{
              scale: hoveredCard === currentProfile.id ? 1.1 : 1,
              opacity: hoveredCard === currentProfile.id ? 0.8 : 0.4
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Main Card */}
          <motion.div
            className="relative backdrop-blur-xl bg-white/80 border border-white/30 rounded-3xl p-8 shadow-2xl overflow-hidden"
            animate={{
              y: hoveredCard === currentProfile.id ? -8 : 0,
              scale: hoveredCard === currentProfile.id ? 1.02 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Floating Animation */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotateZ: [0, 1, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {/* Profile Image */}
              <div className="relative mb-6">
                <motion.div 
                  className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Image
                    src={currentProfile.image}
                    alt={currentProfile.name}
                    width={300}
                    height={375}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badge */}
                  <motion.div 
                    className={`absolute top-4 left-4 bg-gradient-to-r ${currentProfile.badge.color} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-xl flex items-center gap-2 backdrop-blur-sm`}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 0.3, 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 17 
                    }}
                  >
                    {currentProfile.badge.icon}
                    {currentProfile.badge.text}
                  </motion.div>
                </motion.div>
              </div>

              {/* Profile Info */}
              <div className="space-y-4">
                <div>
                  <motion.h3 
                    className="text-2xl font-bold text-gray-900 mb-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {currentProfile.name}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600 text-sm font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {currentProfile.achievement}
                  </motion.p>
                  <motion.p 
                    className="text-indigo-600 text-sm font-semibold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {currentProfile.specialty} Specialist
                  </motion.p>
                </div>

                {/* Rating */}
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                      >
                        <Star 
                          className={`w-4 h-4 ${
                            i < Math.floor(currentProfile.rating) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {currentProfile.rating} ({currentProfile.reviews} reviews)
                  </span>
                </motion.div>

                {/* Secondary CTA - Appears on Hover */}
                <AnimatePresence>
                  {hoveredCard === currentProfile.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <InteractiveButton 
                        variant="primary" 
                        size="md"
                        className="w-full justify-center mt-4"
                        magnetic={false}
                      >
                        Book Trial Session
                      </InteractiveButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="flex justify-center gap-3 mt-8">
        {profiles.map((_, index) => (
          <motion.button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 w-8' 
                : 'bg-gray-300 hover:bg-gray-400 w-2'
            }`}
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          />
        ))}
      </div>
    </div>
  );
};

export { InteractiveCardCarousel };
