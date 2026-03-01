"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Star, Trophy, GraduationCap, DollarSign, Sparkles } from 'lucide-react';
import { GlassCard } from './glass-card';

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
}

const profiles: Profile[] = [
  {
    id: '1',
    name: 'Aarnav T.',
    image: '/Aarnav.png',
    badge: {
      text: 'TOC Champion',
      icon: <Trophy className="w-4 h-4" />,
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500'
    },
    achievement: 'National Tournament Champion',
    rating: 5.0,
    reviews: 127
  },
  {
    id: '2',
    name: 'Henry P.',
    image: '/HenryPan.png',
    badge: {
      text: 'Harvard \'28',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'bg-gradient-to-r from-emerald-400 to-teal-500'
    },
    achievement: 'Ivy League Success Story',
    rating: 4.9,
    reviews: 89
  },
  {
    id: '3',
    name: 'Pearson M.',
    image: '/Pearson.png',
    badge: {
      text: '$50k Scholar',
      icon: <DollarSign className="w-4 h-4" />,
      color: 'bg-gradient-to-r from-purple-400 to-pink-500'
    },
    achievement: 'Full Scholarship Winner',
    rating: 4.8,
    reviews: 156
  },
  {
    id: '4',
    name: 'Savvy R.',
    image: '/Savvy.png',
    badge: {
      text: 'Circuit Star',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'bg-gradient-to-r from-orange-400 to-red-500'
    },
    achievement: 'National Circuit Success',
    rating: 4.9,
    reviews: 203
  }
];

const ProfileCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % profiles.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const currentProfile = profiles[currentIndex];

  return (
    <div 
      className="relative w-full max-w-sm mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProfile.id}
          initial={{ opacity: 0, y: 20, rotateY: -15 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          exit={{ opacity: 0, y: -20, rotateY: 15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <GlassCard className="p-6" glow>
            {/* Profile Image */}
            <div className="relative mb-6">
              <motion.div 
                className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
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
                  className={`absolute top-4 left-4 ${currentProfile.badge.color} text-white px-3 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 17 }}
                >
                  {currentProfile.badge.icon}
                  {currentProfile.badge.text}
                </motion.div>
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {currentProfile.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {currentProfile.achievement}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
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
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {profiles.map((_, index) => (
          <motion.button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-blue-600 w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export { ProfileCarousel };
