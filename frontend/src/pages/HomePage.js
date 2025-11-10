import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import BillCard from '../components/BillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/HomePage.css';

const HomePage = () => {
  const [billLimit, setBillLimit] = useState(6);
  const { data, loading, error, refetch } = useApi('/api/congress', {
    params: { limit: billLimit },
    dependencies: [billLimit]
  });

  const stats = {
    totalBills: data?.pagination?.count || 0,
    activeBills: data?.bills?.filter(b => b.status === 'active')?.length || 0,
    recentActions: data?.bills?.filter(b => b.latestAction)?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  What Did The Government Do Today?
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Track legislative actions and stay informed about government activities
                </p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/congress" className="text-gray-700 hover:text-blue-600 transition-colors">
                Congress Actions
              </Link>
              <Link to="/search" className="text-gray-700 hover:text-blue-600 transition-colors">
                Search Bills
              </Link>
              <Link to="/members" className="text-gray-700 hover:text-blue-600 transition-colors">
                Members
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bills</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBills.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Bills</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBills}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Actions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentActions}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Congressional Bills</h2>
            <div className="flex items-center space-x-4">
              <select
                value={billLimit}
                onChange={(e) => setBillLimit(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={3}>Show 3</option>
                <option value={6}>Show 6</option>
                <option value={9}>Show 9</option>
                <option value={12}>Show 12</option>
              </select>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {loading && <LoadingSpinner message="Loading congressional bills..." />}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Error loading bills</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={refetch}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

          {data?.bills && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.bills.map((bill, index) => (
                  <BillCard key={bill.slug || index} bill={bill} />
                ))}
              </div>

              {data.bills.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No bills found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your filters or check back later.
                  </p>
                </div>
              )}

              <div className="mt-8 text-center">
                <Link
                  to="/congress"
                  className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
                >
                  View All Congressional Actions
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <img src="/CongressIcon.png" alt="Congress" className="w-12 h-12 mr-4" />
              <h3 className="text-lg font-bold text-gray-900">Track Congress</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Monitor bills, resolutions, and legislative actions in real-time.
            </p>
            <Link to="/congress" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              Explore Congress
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <img src="/PresidentIcon.png" alt="Executive" className="w-12 h-12 mr-4" />
              <h3 className="text-lg font-bold text-gray-900">Executive Actions</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View presidential orders, memoranda, and executive branch activities.
            </p>
            <span className="text-gray-400 font-medium">Coming Soon</span>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <svg className="w-12 h-12 mr-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900">Supreme Court</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Follow Supreme Court decisions and judicial branch updates.
            </p>
            <span className="text-gray-400 font-medium">Coming Soon</span>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm">
              Data provided by the official Congress.gov API
            </p>
            <p className="text-xs mt-2 text-gray-400">
              © 2025 What Did The Government Do Today. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;