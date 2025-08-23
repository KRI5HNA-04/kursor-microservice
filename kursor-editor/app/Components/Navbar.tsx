"use client";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect, memo } from "react";
import Image from "next/image";

function NavbarInner() {
  const router = useRouter();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center bg-transparent backdrop-blur-md border-b border-white/10 z-50">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/")}
      >
        {/* Logo */}
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
          K
        </div>
        <span className="text-xl font-semibold text-white">Kursor</span>
      </div>

      <nav className="hidden md:flex gap-6 text-sm text-gray-300">
        <a href="/editor" className="hover:text-white transition">
          Editor
        </a>
        <a href="/features" className="hover:text-white transition">
          Features
        </a>

        <a href="/about" className="hover:text-white transition">
          About
        </a>
        <a href="/contact" className="hover:text-white transition">
          Contact
        </a>
      </nav>

      <div className="flex items-center gap-4">
        {session && session.user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              <Image
                src={
                  ("/api/profile/avatar?ts=" + Date.now()) as unknown as string
                }
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
                priority={false}
                unoptimized
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 text-gray-800">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/profile");
                  }}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  onClick={() => {
                    setDropdownOpen(false);
                    localStorage.removeItem("kursor-editor-settings");
                    signOut();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="text-sm text-gray-300 hover:text-white transition cursor-pointer"
            >
              Login
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-full shadow-lg transition cursor-pointer">
              Get Started
            </button>
          </>
        )}
      </div>
    </header>
  );
}

const Navbar = memo(NavbarInner);
export default Navbar;
