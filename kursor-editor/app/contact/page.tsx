"use client";

import React, { useState } from "react";
import Navbar from "../Components/Navbar";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<null | "success" | "error" | "loading">(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      setErrorMsg(null);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: feedback }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("success");
        setName("");
        setEmail("");
        setFeedback("");
        setPreviewUrl(data?.previewUrl || null);
      } else {
        setStatus("error");
        try {
          const data = await res.json();
          setErrorMsg(data?.error || data?.details || null);
        } catch {}
      }
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e?.message ?? "Network error");
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#18181b] via-[#23232b] to-[#18181b] -z-20" />
      <Navbar />
      <div className="max-w-3xl mx-auto mt-40 rounded-2xl shadow-xl overflow-hidden bg-white/5 backdrop-blur-lg border border-white/30 p-8">
        <h2 className="text-3xl font-bold text-white mb-2">Contact us</h2>
        <p className="text-gray-300 mb-6">We'd love your feedback.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-white/20 rounded-lg bg-black/20 text-white placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-white/20 rounded-lg bg-black/20 text-white placeholder-gray-400"
          />
          <textarea
            name="feedback"
            placeholder="Your feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            rows={6}
            className="w-full px-4 py-2 border border-white/20 rounded-lg bg-black/20 text-white placeholder-gray-400 resize-y"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 rounded-lg bg-orange-500/90 hover:bg-orange-400 text-white font-semibold transition shadow-lg"
          >
            {status === "loading" ? "Sending..." : "Send"}
          </button>
          {status === "success" && (
            <div className="text-green-400 font-medium text-center">
              <p>Thanks! Your message has been sent.</p>
              {previewUrl && (
                <p className="mt-1 text-sm">
                  Preview (dev only):{" "}
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-green-300"
                  >
                    Open Ethereal message
                  </a>
                </p>
              )}
            </div>
          )}
          {status === "error" && (
            <div className="text-red-400 font-medium text-center">
              <p>Something went wrong. Please try again.</p>
              {errorMsg && (
                <p className="mt-1 text-sm text-red-300 break-words">
                  {errorMsg}
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
