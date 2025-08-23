"use client";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Footer from "./Footer";

// Lazy WebGL + code snippet
const Silk = dynamic(() => import("./ui/Silk"), {
  ssr: false,
  loading: () => null,
});
const CodeSnippet = dynamic(() => import("./CodeSnippet"), {
  ssr: false,
  loading: () => (
    <div className="w-[50%] mx-auto mt-20 h-40 animate-pulse bg-white/5 rounded-xl" />
  ),
});

export default function LandingClient() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
      >
        <Silk />
      </div>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.4)",
          pointerEvents: "none",
        }}
      />
      <Navbar />
      <Hero />
      <CodeSnippet />
      <Footer />
    </>
  );
}
