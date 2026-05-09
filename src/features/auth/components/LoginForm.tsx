"use client";

import { Eye, EyeOff, LockKeyhole, Mail, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { AuthService } from "../../../services/auth.service";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const footerLinks = ["Privacy Policy", "Terms of Service", "System Status"];

  // Ensure component only renders on client side to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('LoginForm: handleSubmit called'); // Debug log
    e.preventDefault();
    console.log('LoginForm: preventDefault called, about to start login process'); // Debug log
    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log('Attempting login with:', { email }); // Debug log
      console.log('Login function:', typeof login); // Debug log
      console.log('Login function exists:', !!login); // Debug log
      
      if (!login) {
        console.error('Login function is not available!');
        setErrorMessage("Authentication system error. Please refresh the page.");
        return;
      }

      // Test direct API call first
      console.log('Testing direct API call...');
      try {
        const testResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        console.log('Direct API test - Status:', testResponse.status);
        console.log('Direct API test - OK:', testResponse.ok);
        const testResult = await testResponse.json();
        console.log('Direct API test - Result:', testResult);
        
        // If direct API call works, the issue is in AuthService
        if (testResponse.ok && (testResult.IsSuccess || testResult.isSuccess)) {
          console.log('Direct API call succeeded, issue is in AuthService.login');
        }
      } catch (testError) {
        console.error('Direct API test failed:', testError);
      }
      
      const success = await login(email, password);
      
      console.log('Login result:', success); // Debug log
      
      if (success) {
        // Store in localStorage if remember is checked
        if (remember && typeof window !== 'undefined') {
          localStorage.setItem("autoflow_remember", "true");
        }
        
        console.log('Login successful, redirecting to dashboard...'); // Debug log
        
        // Wait a moment for the user state to be set, then redirect based on role
        setTimeout(() => {
          const currentUser = AuthService.getCurrentUser();
          if (currentUser?.roles?.includes('Admin')) {
            router.push("/admin/dashboard");
          } else if (currentUser?.roles?.includes('Staff')) {
            router.push("/staff/dashboard");
          } else {
            router.push("/customer/dashboard");
          }
        }, 100);
      } else {
        setErrorMessage("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error('Login form error:', error); // Debug log
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(
        message.includes("Failed to fetch")
          ? "Network error: could not reach the login API."
          : message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state until component is mounted on client
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#f3f5fb] px-4 py-8 text-slate-700">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[920px] flex-col items-center justify-center gap-4">
          <main className="flex w-full justify-center py-20">
            <section className="w-full max-w-[410px] rounded-2xl bg-white px-6 pb-8 pt-7 shadow-[0_18px_40px_rgba(85,93,128,0.12)] ring-1 ring-black/5 sm:px-7">
              <div className="flex flex-col items-center text-center">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#efeefe] text-[#4f46e5] shadow-[0_2px_6px_rgba(79,70,229,0.08)]">
                  <Zap size={22} strokeWidth={2.4} aria-hidden="true" />
                </div>
                <h1 className="mt-4 text-[28px] font-semibold leading-none tracking-tight text-slate-800">
                  AutoFlow
                </h1>
                <p className="mt-2 text-[13px] font-medium text-slate-500">
                  Precision Management Portal
                </p>
              </div>
              <div className="mt-8 flex items-center justify-center">
                <div className="text-slate-500">Loading...</div>
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f5fb] px-4 py-8 text-slate-700">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[920px] flex-col items-center justify-center gap-4">
        <main className="flex w-full justify-center py-20">
          <section className="w-full max-w-[410px] rounded-2xl bg-white px-6 pb-8 pt-7 shadow-[0_18px_40px_rgba(85,93,128,0.12)] ring-1 ring-black/5 sm:px-7">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#efeefe] text-[#4f46e5] shadow-[0_2px_6px_rgba(79,70,229,0.08)]">
                <Zap size={22} strokeWidth={2.4} aria-hidden="true" />
              </div>
              <h1 className="mt-4 text-[28px] font-semibold leading-none tracking-tight text-slate-800">
                AutoFlow
              </h1>
              <p className="mt-2 text-[13px] font-medium text-slate-500">
                Precision Management Portal
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
                  Email Address
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@autoflow.com"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-[#edf0f6] bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-300 focus:border-[#d9def0] focus:ring-2 focus:ring-[#dad8ff]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <LockKeyhole size={16} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-[#edf0f6] bg-white py-3 pl-10 pr-10 text-sm text-slate-800 outline-none placeholder:text-slate-300 focus:border-[#d9def0] focus:ring-2 focus:ring-[#dad8ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label="Toggle password visibility"
                    suppressHydrationWarning
                  >
                    {showPassword ? (
                      <EyeOff size={18} strokeWidth={2} aria-hidden="true" />
                    ) : (
                      <Eye size={18} strokeWidth={2} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-sm">
                <label className="inline-flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                    className="size-4 rounded border-slate-300 text-[#4f46e5] focus:ring-[#dad8ff]"
                  />
                  Remember device
                </label>
                <Link
                  href="/forgot-password"
                  className="font-semibold text-[#4338ca] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                suppressHydrationWarning
                onClick={() => console.log('Login button clicked!')}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#3f2fd8] to-[#5d56f0] px-4 py-3.5 text-base font-semibold text-white shadow-[0_8px_18px_rgba(63,47,216,0.28)] transition hover:brightness-105 disabled:opacity-60"
              >
                {isLoading ? "Logging in…" : "Login"}
              </button>

              <div className="pt-7 text-center">
                <p className="text-[13px] text-slate-500">
                  Don&apos;t have an account yet?
                </p>
                <Link
                  href="/signup"
                  className="mt-4 block rounded-xl border border-[#edf0f6] bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Create an Account
                </Link>
              </div>
            </form>
          </section>
        </main>

        <footer className="flex flex-col items-center gap-4 pb-2 text-center">
          <h2 className="text-[26px] font-semibold tracking-tight text-[#93a0b8]">
            AutoFlow
          </h2>
          <nav className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#a2abc0]">
            {footerLinks.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </nav>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#a2abc0]">
            © 2026 AutoFlow. Precision Vehicle Management.
          </p>
        </footer>
      </div>
    </div>
  );
}
