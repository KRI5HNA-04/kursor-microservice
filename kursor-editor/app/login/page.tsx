"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuroraBackground } from "../Components/ui/aurora-background";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/editor");
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Check if email exists
      const res = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.exists) {
        setError("No account found with this email. Please create an account.");
        setLoading(false);
        return;
      }
      // Use NextAuth credentials provider
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      router.push("/editor");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuroraBackground className="relative flex items-center justify-center min-h-screen bg-black/60 text-white">
      <Image
        src="/file.svg"
        alt="background"
        fill
        className="object-cover opacity-40 -z-10"
        priority
      />

      <div className="bg-white/5 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Login to continue coding smarter with{" "}
          <span className="text-purple-400 font-semibold">Kursor</span>
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="text-red-400 text-sm text-center mb-2">{error}</div>
          )}
          <div>
            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors py-2 rounded-md text-sm font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{" "}
            <span
              className="text-purple-400 hover:underline cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              Sign up
            </span>
          </div>
        </form>

        <div className="mt-6 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors py-2 rounded-md text-sm font-semibold text-white border border-white/20"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_17_40)">
                <path
                  d="M47.532 24.552c0-1.636-.146-3.192-.418-4.668H24.48v9.086h13.002c-.56 3.02-2.24 5.58-4.78 7.302v6.06h7.74c4.54-4.18 7.09-10.34 7.09-17.78z"
                  fill="#4285F4"
                />
                <path
                  d="M24.48 48c6.48 0 11.94-2.14 15.92-5.82l-7.74-6.06c-2.14 1.44-4.88 2.3-8.18 2.3-6.28 0-11.6-4.24-13.5-9.94H2.6v6.24C6.56 43.98 14.84 48 24.48 48z"
                  fill="#34A853"
                />
                <path
                  d="M10.98 28.48c-.5-1.44-.8-2.98-.8-4.48s.3-3.04.8-4.48v-6.24H2.6A23.98 23.98 0 000 24c0 3.98.96 7.74 2.6 10.72l8.38-6.24z"
                  fill="#FBBC05"
                />
                <path
                  d="M24.48 9.52c3.54 0 6.68 1.22 9.16 3.62l6.84-6.84C36.42 2.14 30.96 0 24.48 0 14.84 0 6.56 4.02 2.6 10.72l8.38 6.24c1.9-5.7 7.22-9.94 13.5-9.94z"
                  fill="#EA4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_17_40">
                  <path fill="#fff" d="M0 0h48v48H0z" />
                </clipPath>
              </defs>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </AuroraBackground>
  );
}
