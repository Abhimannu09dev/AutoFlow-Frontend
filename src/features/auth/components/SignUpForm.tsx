"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Mail, Phone } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export function SignUpForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        address: "",
      };

      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => null);

      if (res.ok) {
        router.push("/login");
      } else {
        const message =
          result?.message ?? result?.Message ?? result?.errors ?? res.statusText ?? "Registration failed.";
        setErrorMessage(typeof message === "string" ? message : JSON.stringify(message));
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setErrorMessage(
        msg.includes("Failed to fetch")
          ? "Network error: could not reach backend."
          : msg
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex lg:flex-row flex-col">
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-12 py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-md">
            <p className="text-sm font-bold text-blue-600 mb-4 tracking-widest">AUTOFLOW</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Precision in every cycle.
            </h1>
            <p className="text-sm text-gray-600 mb-12 leading-relaxed">
              Elevate your vehicle management with the industry&apos;s most refined digital platform.
            </p>
            <div className="relative mb-8 h-80 overflow-hidden rounded-2xl border border-gray-700 shadow-2xl">
              <Image
                src="/PrecisionComponents.png"
                alt="Precision mechanical component"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/45 via-gray-950/10 to-transparent" />
            </div>
            <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-white" />
              </div>
              <p className="text-xs text-gray-600 font-medium">TRUSTED BY 500+ ATELIERS</p>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
              <p className="text-gray-600">Join the AutoFlow ecosystem today.</p>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold text-gray-700 mb-2 tracking-wide">
                  FULL NAME
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Jonathan Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-2 tracking-wide">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@atelier.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-bold text-gray-700 mb-2 tracking-wide">
                  PHONE NUMBER
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-gray-700 mb-2 tracking-wide">
                  PASSWORD
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-8 shadow-lg"
              >
                {isLoading ? "Creating Account…" : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
