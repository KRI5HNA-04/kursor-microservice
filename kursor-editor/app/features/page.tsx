"use client";
import { HoverEffect } from "../Components/ui/card-hover-effect";

import { motion } from "framer-motion";
import {
  Code,
  Palette,
  Type,
  Settings2,
  Save,
  WrapText,
  Sparkles,
  User,
  Database,
  Zap,
} from "lucide-react";
import Particles from "@tsparticles/react";
import { useEffect, useState, useMemo } from "react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { MoveDirection, OutMode } from "@tsparticles/engine";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={features} />
    </div>
  );
}

const features = [
  {
    title: "AI-Powered Code Editor",
    description:
      "⚡ Blazing-fast, AI-powered online code editor built for focus and flow.",
    link: "#",
  },
  {
    title: "Multiple Themes",
    description:
      "🎨 Switch between Light, Dark, Dracula, Monokai, and more for your perfect coding vibe.",
    link: "#",
  },
  {
    title: "Font Customization",
    description:
      "🔤 Choose from Fira Code, JetBrains Mono, Source Code Pro, and set your preferred font size.",
    link: "#",
  },
  {
    title: "Tab & Indentation Control",
    description:
      "⚙️ Easily switch between tabs/spaces and set your preferred tab width.",
    link: "#",
  },
  {
    title: "Auto Save",
    description: "💾 Never lose your work. Enable auto save for peace of mind.",
    link: "#",
  },
  {
    title: "Line Wrapping",
    description: "↩️ Toggle line wrapping for a comfortable coding experience.",
    link: "#",
  },
  {
    title: "Autocomplete & IntelliSense",
    description:
      "✨ Boost productivity with smart code suggestions and completions.",
    link: "#",
  },
  {
    title: "Enable/Disable Linting",
    description:
      "🔍 Toggle linting to keep your code clean or distraction-free.",
    link: "#",
  },
  {
    title: "Profile Management",
    description:
      "👤 Update your profile, picture, bio, and connect social accounts.",
    link: "#",
  },
  {
    title: "Persistent Settings",
    description:
      "🗄️ Your editor settings are saved and restored automatically for each session.",
    link: "#",
  },
  {
    title: "Modern UI & Animations",
    description:
      "💎 Enjoy a beautiful, modern interface with smooth animations everywhere.",
    link: "#",
  },
];

// const cardVariants = {
//   offscreen: { opacity: 0, y: 60, scale: 0.95 },
//   onscreen: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { type: "spring" as const, bounce: 0.3, duration: 0.7 },
//   },
// };

export default function FeaturesPage() {
  const [particlesInit, setParticlesInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesInit(true));
  }, []);

  const particlesOptions = useMemo(
    () => ({
      fullScreen: false,
      background: { color: "transparent" },
      fpsLimit: 60,
      particles: {
        number: {
          value: 100,
          density: { enable: true },
        },
        color: { value: "#ffffff" },
        opacity: { value: 1 },
        size: { value: { min: 1, max: 3 } },
        move: {
          enable: true,
          speed: 1,
          direction: MoveDirection.none,
          outModes: { default: OutMode.out },
        },
        links: {
          enable: true,
          distance: 120,
          color: "#fff",
          opacity: 0.07,
          width: 1,
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <>
      <div className="relative min-h-screen w-full bg-gradient-to-br from-[#18181b] via-[#23232b] to-[#18181b] py-30 px-4 flex flex-col items-center overflow-hidden">
        <Navbar />
        {/* Particle Background */}
        {particlesInit && (
          <Particles
            id="tsparticles-features"
            className="absolute inset-0 w-full h-full z-0"
            options={particlesOptions}
          />
        )}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
        >
          Features
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative z-10 text-lg text-gray-300 max-w-2xl text-center mb-16"
        >
          Discover all the ways Kursor helps you code smarter, faster, and with
          more joy.
        </motion.p>
        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <HoverEffect items={features} />
        </div>
      </div>
      <Footer />
    </>
  );
}
