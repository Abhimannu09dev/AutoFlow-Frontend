'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex lg:flex-row flex-col">

        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-12 py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-md ">
          <p className="text-sm font-bold text-blue-600 mb-4 tracking-widest">AUTOFLOW</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Precision in every cycle.
          </h1>
          <p className="text-sm text-gray-600 mb-12 leading-relaxed">
            Elevate your parts management with the industry's most refined digital curator.
          </p>
          
          {/* Placeholder for mechanical part image */}
          <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl mb-8 h-80 flex items-center justify-center border border-gray-700">
            <div className="text-gray-600 text-center">
              <p className="text-sm">Mechanical Part Image</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-white"></div>
            </div>
            <p className="text-xs text-gray-600 font-medium">TRUSTED BY 500+ ATELIERS</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">
              Join the AutoFlow ecosystem today.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-gray-700 mb-2 tracking-wide">
                FULL NAME
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">👤</span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Jonathan Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-2 tracking-wide">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">✉️</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@atelier.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-xs font-bold text-gray-700 mb-2 tracking-wide">
                PHONE NUMBER
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">📱</span>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-700 mb-2 tracking-wide">
                PASSWORD
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mt-8 shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Login
            </Link>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-500 space-x-6">
            <span>PRIVACY POLICY</span>
            <span>TERMS OF SERVICE</span>
            <span>SYSTEM STATUS</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
