"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiBookOpen,
  FiBriefcase,
} from "react-icons/fi";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student", // default category: 'student' | 'teacher' | 'user'
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role: string) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return false;
    }

    if (isSignUp) {
      if (!formData.name) {
        setError("Full name is required");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // SIGN UP
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              role: formData.role,
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data.user) {
          // Sign up successful
          setError(null);
          alert("Account created! Please check your email to confirm.");
          // Optionally redirect or reset form
        }
      } else {
        // SIGN IN
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        if (data.user) {
          // Sign in successful - redirect to dashboard
          router.push("/dashboard");
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      id: "student",
      label: "Student",
      icon: FiUser,
      description: "Study & notes",
    },
    {
      id: "teacher",
      label: "Teacher",
      icon: FiBookOpen,
      description: "Lessons & plans",
    },
    {
      id: "user",
      label: "General",
      icon: FiBriefcase,
      description: "Personal & work",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col lg:flex-row antialiased selection:bg-[#0D530E] selection:text-white">
      {/* Left Panel - Brand Showcase */}
      <section className="hidden lg:flex lg:w-1/2 bg-[#0D530E] relative overflow-hidden p-12 flex-col justify-between text-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10">
          <Link
            className="inline-flex items-center gap-2 text-2xl font-bold"
            href="/"
          >
            <Image
              src="/notepad.png"
              alt="NoteHub logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
            />
            <span className="text-2xl font-extrabold tracking-tight">
              NoteHub
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg my-auto py-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold tracking-wider uppercase mb-6 border border-white/15">
            Smart & Secure Workspace
          </span>
          <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight mb-6">
            Organize your thoughts into actionable wisdom.
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Join thousands of students, educators, and professionals capturing
            their ideas with NoteHub.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-emerald-100 font-medium">
              <FiCheckCircle className="text-emerald-300 shrink-0" size={18} />
              <span>Real-time cross-device cloud synchronization</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-emerald-100 font-medium">
              <FiCheckCircle className="text-emerald-300 shrink-0" size={18} />
              <span>End-to-end encrypted notes & documentation</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-emerald-100 font-medium">
              <FiCheckCircle className="text-emerald-300 shrink-0" size={18} />
              <span>Instant full-text search & flexible organization</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/60">
          &copy; {new Date().getFullYear()} NoteHub Inc. All rights reserved.
        </div>
      </section>

      {/* Right Panel - Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 my-auto">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-gray-200/80 shadow-xl sm:shadow-2xl">
          <div className="lg:hidden flex justify-center mb-6">
            <Link
              className="flex items-center gap-2 text-2xl font-bold"
              href="/"
            >
              <Image
                src="/notepad.png"
                alt="NoteHub logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <span className="text-2xl font-extrabold text-[#0D530E] tracking-tight">
                NoteHub
              </span>
            </Link>
          </div>

          <div className="text-center sm:text-left mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isSignUp
                ? "Start capturing and organizing your notes in seconds."
                : "Enter your credentials to access your workspace."}
            </p>
          </div>

          {/* Social Sign-In */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-300 shadow-xs transition-colors duration-200"
          >
            <FcGoogle size={22} />
            <span>
              {isSignUp ? "Sign up with Google" : "Sign in with Google"}
            </span>
          </button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative z-10 bg-white px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D530E] focus:ring-2 focus:ring-[#0D530E]/20 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            {/* Account Category / Role Selection (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  I am joining as a
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formData.role === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleRoleSelect(cat.id)}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center transition-all duration-200 ${
                          isSelected
                            ? "border-[#0D530E] bg-emerald-50/80 text-[#0D530E] ring-2 ring-[#0D530E]/20 font-bold shadow-xs"
                            : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Icon
                          size={18}
                          className={
                            isSelected ? "text-[#0D530E]" : "text-gray-400"
                          }
                        />
                        <span className="text-xs mt-1.5 font-semibold">
                          {cat.label}
                        </span>
                        <span className="text-[10px] text-gray-400 font-normal mt-0.5 hidden sm:block">
                          {cat.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D530E] focus:ring-2 focus:ring-[#0D530E]/20 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                {!isSignUp && (
                  <Link
                    href="/forgotpassword"
                    className="text-xs font-bold text-[#0D530E] hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <FiLock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D530E] focus:ring-2 focus:ring-[#0D530E]/20 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D530E] focus:ring-2 focus:ring-[#0D530E]/20 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0D530E] hover:bg-[#0A430B] disabled:bg-gray-400 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group mt-2"
            >
              <span>
                {loading
                  ? "Loading..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign In"}
              </span>
              <FiArrowRight
                className={`${loading ? "opacity-0" : "group-hover:translate-x-1"} transition-transform`}
              />
            </button>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-bold text-[#0D530E] hover:underline focus:outline-none"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
