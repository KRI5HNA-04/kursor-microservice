"use client";
import React from "react";
import Navbar from "../Components/Navbar";

const AboutPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      <Navbar />
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover z-0 rounded-xl"
        style={{
          maxWidth: "1700px",
          maxHeight: "90vh",
          width: "100%",
          height: "100%",
        }}
      >
        <source src="/background_vid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main Content */}
      <main className="mt-20 relative z-10 max-w-4xl w-full px-6 py-12 md:px-10 rounded-3xl bg-white/5 backdrop-blur-md border border-white/20 shadow-2xl">
        <h1 className="text-5xl font-bold text-center text-white mb-12 tracking-tight">
          About <span className="text-blue-400">Kursor</span>
        </h1>

        <section className="mb-10 transition hover:scale-[1.01]">
          <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-2 mb-3">
            <span role="img" aria-label="developer">
              👨‍💻
            </span>{" "}
            About the Developer
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed">
            I'm the developer behind Kursor, building tools that empower
            creators and learners. With a background in software engineering and
            a passion for intuitive design, I strive to make coding more
            enjoyable and accessible for all.
          </p>
        </section>

        <hr className="border-white/10 my-8" />

        <section className="mb-10 transition hover:scale-[1.01]">
          <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-2 mb-3">
            <span role="img" aria-label="rocket">
              🚀
            </span>{" "}
            Vision & Mission
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed">
            <strong className="text-white">Vision:</strong> To build a seamless,
            collaborative, and inspiring coding space for learners, educators,
            and developers globally.
            <br />
            <strong className="text-white">Mission:</strong> To bridge the gap
            between learning and building by offering a real-time, user-friendly
            code editor backed by community and innovation.
          </p>
        </section>

        <hr className="border-white/10 my-8" />

        <section className="transition hover:scale-[1.01]">
          <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-2 mb-3">
            <span role="img" aria-label="pin">
              📌
            </span>{" "}
            How the Project Started
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed">
            Kursor began as a personal challenge during my learning journey.
            Frustrated with the lack of collaborative tools, I created Kursor to
            make real-time coding fun, accessible, and community-driven. What
            began as an experiment is now a growing initiative for the next-gen
            developer.
          </p>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
