"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../Components/Navbar";
import { AuroraBackground } from "../Components/ui/aurora-background";
import { compressImage, validateImageFile } from "../libs/imageUtils";
import {
  Camera,
  Save,
  Github,
  Linkedin,
  Phone,
  User,
  FileText,
} from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  mobile: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  image: string | null;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    mobile: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.email) {
      setLoading(false);
      setError("You must be logged in to view this page.");
      return;
    }
    fetchProfile();
    // Only run when session changes
    // eslint-disable-next-line
  }, [session, status]);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        setError("Failed to load profile.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setProfileData({
        name: data.name || "",
        email: data.email || "",
        mobile: data.mobile || "",
        bio: data.bio || "",
        githubUrl: data.githubUrl || "",
        linkedinUrl: data.linkedinUrl || "",
        image: data.image || null,
      });
    } catch (e) {
      setError("An error occurred while loading profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file first
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    // Clear previous errors and show loading
    setError("");
    setLoading(true);

    try {
      // Compress the image
      const compressedImage = await compressImage(file, 600, 0.8);

      // Additional check for compressed image size
      if (compressedImage.length > 6000000) {
        // ~4.5MB in base64
        setError(
          "Image is still too large after compression. Please use a smaller image."
        );
        setLoading(false);
        return;
      }

      setNewImage(compressedImage);
      setProfileData((prev) => ({ ...prev, image: compressedImage }));
      setMessage(
        "Image compressed and selected successfully! Don't forget to save."
      );
      setLoading(false);
    } catch (error) {
      console.error("Image processing error:", error);
      setError(
        "Failed to process the image. Please try again with a different image."
      );
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (!res.ok) {
        setError("Failed to update profile.");
        setSaving(false);
        return;
      }
      setMessage("Profile updated successfully!");
      setNewImage(null);
      if (typeof update === "function") {
        // Pass changes so NextAuth can propagate into the JWT via trigger==='update'
        await update({
          name: profileData.name,
          image: profileData.image || null,
        } as any);
      }
    } catch (e) {
      setError("An error occurred while updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuroraBackground className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-start">
        <Navbar />
        <div className="w-full max-w-5xl mx-auto px-4 py-10">
          <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl px-10 py-12 animate-pulse">
            <div className="h-10 w-1/3 bg-white/20 rounded mb-8 mx-auto" />
            <div className="flex gap-12">
              <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-6" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-white/20 rounded w-2/3" />
                <div className="h-8 bg-white/20 rounded w-1/2" />
                <div className="h-8 bg-white/20 rounded w-1/3" />
              </div>
            </div>
            <div className="h-32 bg-white/20 rounded mt-8" />
          </div>
        </div>
      </AuroraBackground>
    );
  }
  if (error) {
    return (
      <AuroraBackground className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-start">
        <Navbar />
        <div className="mt-80 w-full max-w-5xl mx-auto px-4 py-10">
          <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl px-10 py-12">
            <div className="text-lg text-red-400">{error}</div>
          </div>
        </div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground className="min-h-screen w-full bg-black text-white flex items-center justify-center">
      <Navbar />
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl px-10 py-12">
          <h1 className="text-4xl font-extrabold text-center mb-10">
            Profile Settings
          </h1>
          {message && (
            <div className="text-center mb-6 p-3 rounded-md bg-green-500/20 text-green-400">
              {message}
            </div>
          )}
          {error && (
            <div className="text-center mb-6 p-3 rounded-md bg-red-500/20 text-red-400">
              {error}
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="rounded-full overflow-hidden bg-purple-600 w-32 h-32 flex items-center justify-center text-white text-4xl font-bold">
                    {profileData.image &&
                    (profileData.image.startsWith("http") ||
                      profileData.image.startsWith("data:image")) ? (
                      <Image
                        src={profileData.image}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span>
                        {profileData.name
                          ? profileData.name.charAt(0).toUpperCase()
                          : "U"}
                      </span>
                    )}
                  </div>
                  {/* Camera Icon Button */}
                  <label
                    className="absolute -bottom-2 -right-2 bg-white border border-purple-500 shadow-lg rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-all"
                    title="Change profile picture"
                  >
                    <Camera
                      size={16}
                      className="text-purple-600 hover:text-white"
                    />
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                </div>
                <div className="mt-3 text-xs text-gray-400 text-center">
                  <p>Supported formats: JPEG, PNG, GIF, WebP</p>
                  <p>Maximum size: 5MB</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <User size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-gray-400 cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Phone size={16} />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.mobile}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        mobile: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FileText size={16} />
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-300">
                  Social Media
                </h3>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Github size={16} />
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    value={profileData.githubUrl}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        githubUrl: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Linkedin size={16} />
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={profileData.linkedinUrl}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        linkedinUrl: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Save Button */}
          <div className="mt-10 text-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 transition-colors px-10 py-3 rounded-full text-white font-semibold flex items-center justify-center gap-2 mx-auto"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
