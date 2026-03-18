import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CongressActions from "./components/CongressActions";
import BillDetailPage from "./pages/BillDetailPage";
import SearchPage from "./pages/SearchPage";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/congress" element={<CongressActions />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/bill/:billSlug" element={<BillDetailPage />} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Go Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
