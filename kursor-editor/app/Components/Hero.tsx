"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import "../../app/globals.css";
import { SparklesText } from "./ui/SparklesText";
import { MorphingText } from "./ui/MorphingText";

import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import FuzzyText from "./ui/FuzzyText";

export default function Hero() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <section className="relative text-center py-15 mt-15 px-6 overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight flex flex-wrap items-center justify-center w-1xl">
          Code smarter with
          <span className="inline-block align-middle justify-center ml-5 mb-3">
            <FuzzyText
              baseIntensity={0.2}
              hoverIntensity={0.5}
              enableHover={true}
            >
              Kursor
            </FuzzyText>
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          A blazing-fast, AI-powered online code editor built for focus and
          flow.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => {
              if (session) {
                router.push("/editor");
              } else {
                router.push("/login");
              }
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg transition cursor-pointer"
          >
            Start Coding
          </button>
          <button
            onClick={() => {
              router.push("/about");
            }}
            className="border border-white/20 text-gray-300 hover:text-white hover:border-white px-6 py-3 rounded-full text-sm transition cursor-pointer"
          >
            Read More...
          </button>
        </div>
      </div>
    </section>
  );
}
