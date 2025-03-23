"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="w-full bg-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Railway Cleaning Management System
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl animate-fade-in-delay">
            Streamline your railway cleaning operations with our comprehensive management solution.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Admin Card */}
          <Link href="/login?role=admin" className="transform hover:scale-105 transition-all duration-300">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-3xl mb-4">👨‍💼</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Admin Dashboard</h2>
              <p className="text-gray-600 mb-4">Manage operations, workers, and view analytics</p>
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center group">
                Access Dashboard
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </Link>

          {/* Worker Card */}
          <Link href="/login?role=worker" className="transform hover:scale-105 transition-all duration-300">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-3xl mb-4">👷</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Worker Dashboard</h2>
              <p className="text-gray-600 mb-4">View assignments and update cleaning status</p>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center group">
                Start Working
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Why Choose Our System?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Monitor cleaning progress in real-time</p>
            </div>
            <div className="p-6">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-lg font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Access from any device, anywhere</p>
            </div>
            <div className="p-6">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">Detailed reports and insights</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
