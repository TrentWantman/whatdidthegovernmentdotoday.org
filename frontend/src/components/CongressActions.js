import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import BillCard from './BillCard';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';

const CongressActions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    sort: 'updateDate+desc',
    congress: '',
    chamber: '',
    billType: ''
  });

  const offset = (currentPage - 1) * itemsPerPage;

  const { data, loading, error, refetch } = useApi('/api/congress/actions', {
    params: {
      offset,
      limit: itemsPerPage,
      sort: filters.sort,
      ...(filters.congress && { congress: filters.congress }),
      ...(filters.chamber && { chamber: filters.chamber }),
      ...(filters.billType && { billType: filters.billType })
    },
    dependencies: [offset, itemsPerPage, filters]
  });

  const totalPages = data?.pagination?.totalPages || Math.ceil((data?.pagination?.count || 0) / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      sort: 'updateDate+desc',
      congress: '',
      chamber: '',
      billType: ''
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Congressional Actions</h1>
                <p className="text-sm text-gray-600">Track all legislative activities</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/search" className="text-gray-700 hover:text-blue-600 transition-colors">Search</Link>
              <Link to="/members" className="text-gray-700 hover:text-blue-600 transition-colors">Members</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {(filters.congress || filters.chamber || filters.billType) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="updateDate+desc">Most Recent</option>
                <option value="updateDate+asc">Oldest First</option>
                <option value="number+desc">Bill Number (High to Low)</option>
                <option value="number+asc">Bill Number (Low to High)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Congress
              </label>
              <select
                value={filters.congress}
                onChange={(e) => handleFilterChange('congress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Congresses</option>
                <option value="118">118th Congress (2023-2025)</option>
                <option value="117">117th Congress (2021-2023)</option>
                <option value="116">116th Congress (2019-2021)</option>
                <option value="115">115th Congress (2017-2019)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chamber
              </label>
              <select
                value={filters.chamber}
                onChange={(e) => handleFilterChange('chamber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Chambers</option>
                <option value="house">House</option>
                <option value="senate">Senate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bill Type
              </label>
              <select
                value={filters.billType}
                onChange={(e) => handleFilterChange('billType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="hr">House Bill (H.R.)</option>
                <option value="s">Senate Bill (S.)</option>
                <option value="hjres">House Joint Resolution</option>
                <option value="sjres">Senate Joint Resolution</option>
                <option value="hconres">House Concurrent Resolution</option>
                <option value="sconres">Senate Concurrent Resolution</option>
                <option value="hres">House Simple Resolution</option>
                <option value="sres">Senate Simple Resolution</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading && <LoadingSpinner message="Loading congressional actions..." />}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Error loading actions</p>
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
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {data.pagination?.count || 0} Total Results
                </h3>
                <button
                  onClick={refetch}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>

              {data.bills.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data.bills.map((bill, index) => (
                      <BillCard key={bill.slug || index} bill={bill} />
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={data.pagination?.count || 0}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </>
              ) : (
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
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CongressActions;