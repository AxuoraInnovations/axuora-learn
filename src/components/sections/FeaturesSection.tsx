"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";

interface CardData {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
}

const GradientCard = ({ icon, title, description, linkText }: CardData) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(cardRef, { once: true, amount: 0.2 });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      setMousePosition({ x, y });

      const rotateX = -(y / rect.height) * 5;
      const rotateY = (x / rect.width) * 5;

      setRotation({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-[32px] overflow-hidden"
      style={{
        width: "360px",
        height: "450px",
        transformStyle: "preserve-3d",
        backgroundColor: "#ffffff",
        boxShadow: "0 -10px 100px 10px rgba(59, 130, 246, 0.15), 0 0 10px 0 rgba(0, 0, 0, 0.05)",
      }}
      initial={{ y: 0 }}
      animate={{
        y: isHovered ? -5 : 0,
        rotateX: rotation.x,
        rotateY: rotation.y,
        perspective: 1000,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 35,
          background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.3) 100%)",
          backdropFilter: "blur(2px)",
        }}
        animate={{
          opacity: isHovered ? 0.7 : 0.5,
          rotateX: -rotation.x * 0.2,
          rotateY: -rotation.y * 0.2,
          z: 1,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          zIndex: 0,
          background: "linear-gradient(180deg, #ffffff 0%, #fafafa 70%)",
        }}
        animate={{
          z: -1
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          zIndex: 10,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        animate={{
          z: -0.5
        }}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{
          height: "66.666667%",
          background: `
            radial-gradient(ellipse at bottom right, rgba(59, 130, 246, 0.4) -10%, rgba(14, 165, 233, 0) 70%),
            radial-gradient(ellipse at bottom left, rgba(96, 165, 250, 0.4) -10%, rgba(14, 165, 233, 0) 70%)
          `,
          filter: "blur(40px)",
        }}
        animate={{
          opacity: isHovered ? 0.9 : 0.8,
          y: isHovered ? rotation.x * 0.5 : 0,
          z: 0
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 z-[21]"
        style={{
          height: "66.666667%",
          background: `
            radial-gradient(circle at bottom center, rgba(59, 130, 246, 0.4) -20%, rgba(14, 165, 233, 0) 60%)
          `,
          filter: "blur(45px)",
        }}
        animate={{
          opacity: isHovered ? 0.85 : 0.75,
          y: isHovered ? (10 + rotation.x * 0.3) : 10,
          z: 0
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] z-[25]"
        style={{
          background: "linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.7) 50%, rgba(59, 130, 246, 0.1) 100%)",
        }}
        animate={{
          boxShadow: isHovered
            ? "0 0 20px 4px rgba(59, 130, 246, 0.6), 0 0 30px 6px rgba(96, 165, 250, 0.4), 0 0 40px 8px rgba(147, 197, 253, 0.3)"
            : "0 0 15px 3px rgba(59, 130, 246, 0.5), 0 0 25px 5px rgba(96, 165, 250, 0.3), 0 0 35px 7px rgba(147, 197, 253, 0.2)",
          opacity: isHovered ? 1 : 0.9,
          z: 0.5
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
      />

      <motion.div
        className="relative flex flex-col h-full p-8 z-40"
        animate={{
          z: 2
        }}
      >
        <motion.div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
          style={{
            background: "linear-gradient(225deg, #f3f4f6 0%, #e5e7eb 100%)",
            position: "relative",
            overflow: "hidden"
          }}
          initial={{ filter: "blur(3px)", opacity: 0.7 }}
          animate={{
            filter: "blur(0px)",
            opacity: 1,
            boxShadow: isHovered
              ? "0 8px 16px -2px rgba(0, 0, 0, 0.1), 0 4px 8px -1px rgba(0, 0, 0, 0.06), inset 2px 2px 5px rgba(255, 255, 255, 0.8), inset -2px -2px 5px rgba(0, 0, 0, 0.1)"
              : "0 6px 12px -2px rgba(0, 0, 0, 0.08), 0 3px 6px -1px rgba(0, 0, 0, 0.04), inset 1px 1px 3px rgba(255, 255, 255, 0.6), inset -2px -2px 4px rgba(0, 0, 0, 0.08)",
            z: isHovered ? 10 : 5,
            y: isHovered ? -2 : 0,
            rotateX: isHovered ? -rotation.x * 0.5 : 0,
            rotateY: isHovered ? -rotation.y * 0.5 : 0
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }}
        >
          <div
            className="absolute top-0 left-0 w-2/3 h-2/3 opacity-60"
            style={{
              background: "radial-gradient(circle at top left, rgba(255, 255, 255, 0.9), transparent 80%)",
              pointerEvents: "none",
              filter: "blur(10px)"
            }}
          />

          <div className="flex items-center justify-center w-full h-full relative z-10">
            {icon}
          </div>
        </motion.div>

        <motion.div
          className="mb-auto"
          animate={{
            z: isHovered ? 5 : 2,
            rotateX: isHovered ? -rotation.x * 0.3 : 0,
            rotateY: isHovered ? -rotation.y * 0.3 : 0
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }}
        >
          <motion.h3
            className="text-2xl font-medium text-gray-900 mb-3"
            style={{
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
            initial={{ opacity: 0, y: 32 }}
            animate={
              titleInView
                ? {
                    opacity: 1,
                    y: 0,
                    textShadow: isHovered ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                    filter: "blur(0px)",
                  }
                : { opacity: 0, y: 32 }
            }
            transition={{
              duration: 0.55,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {title}
          </motion.h3>

          <motion.p
            className="text-sm mb-6 text-gray-600"
            style={{
              lineHeight: 1.5,
              fontWeight: 350,
            }}
            initial={{ filter: "blur(3px)", opacity: 0.7 }}
            animate={{
              textShadow: isHovered ? "0 1px 2px rgba(0,0,0,0.03)" : "none",
              filter: "blur(0px)",
              opacity: 0.85,
              transition: { duration: 1.2, delay: 0.4 }
            }}
          >
            {description}
          </motion.p>

          <motion.a
            href="#"
            className="inline-flex items-center text-gray-900 text-sm font-medium group"
            initial={{ filter: "blur(3px)", opacity: 0.7 }}
            animate={{
              filter: "blur(0px)",
              opacity: 0.9,
              transition: { duration: 1.2, delay: 0.6 }
            }}
            whileHover={{
              filter: "drop-shadow(0 0 5px rgba(59, 130, 246, 0.3))"
            }}
          >
            {linkText}
            <motion.svg
              className="ml-1 w-4 h-4"
              width="8"
              height="8"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={{
                x: isHovered ? 4 : 0
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut"
              }}
            >
              <path
                d="M1 8H15M15 8L8 1M15 8L8 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const cards: CardData[] = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 0L9.4 5.4L14.8 5.4L10.6 8.8L12 14.2L8 10.8L4 14.2L5.4 8.8L1.2 5.4L6.6 5.4L8 0Z"
          fill="#374151"
        />
      </svg>
    ),
    title: "AxuoraLearn V1.0 - Your Go-To Study Agent",
    description: "AxuoraLearn V1.0 has everything you need in one place. Flashcards, notes summary, AI Live Lessons, and Full Marks Analyzer.",
    linkText: "Learn More"
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 2L8 8M8 8L14 2M8 8V14"
          stroke="#374151"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Predictive Mock Exams Generator",
    description: "Generate accurate exams questions in seconds that leave you no space for guesses and uncertainty.",
    linkText: "Explore Features"
  }
];

export function FeaturesSection() {
  return (
    <section className="bg-neutral-light py-16 md:py-24">
      <div className="max-w-content mx-auto px-5 md:px-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary font-medium text-sm tracking-wide mb-2">FEATURES</p>
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold leading-[1.1] tracking-[-0.04em] mb-4">
            Smarter Tools to
            <br />
            Accelerate Your Preparation
          </h2>
          <p className="text-theme-7 text-base md:text-lg leading-relaxed">
            Explore features that create flow-state for you, with ease. Fumble is not in our
            dictionary
          </p>
        </div>
        <div className="flex flex-wrap gap-8 justify-center">
          {cards.map((card, index) => (
            <GradientCard key={index} {...card} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/features"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            Explore all features
            <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
