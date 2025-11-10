import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import useDebounce from '../hooks/useDebounce';
import BillCard from '../components/BillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    congress: '',
    chamber: '',
    billType: '',
    sponsor: '',
    dateRange: 'all',
    sort: 'updateDate+desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search query to prevent rapid API calls
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 800);

  const offset = (currentPage - 1) * itemsPerPage;

  const shouldFetch = hasSearched && (debouncedSearchQuery || Object.values(filters).some(v => v && v !== 'all'));

  const { data, loading, error, refetch } = useApi('/api/congress/search', {
    params: {
      query: debouncedSearchQuery,
      offset,
      limit: itemsPerPage,
      ...(filters.congress && { congress: filters.congress }),
      ...(filters.chamber && { chamber: filters.chamber }),
      ...(filters.billType && { billType: filters.billType }),
      ...(filters.sponsor && { sponsor: filters.sponsor }),
      sort: filters.sort
    },
    dependencies: [debouncedSearchQuery, offset, itemsPerPage, filters],
    autoFetch: shouldFetch
  });

  const totalPages = data?.pagination?.totalPages || Math.ceil((data?.pagination?.count || 0) / itemsPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    setCurrentPage(1);
    if (shouldFetch) refetch();
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    if (hasSearched) {
      setCurrentPage(1);
    }
  };

  const clearAll = () => {
    setSearchQuery('');
    setFilters({
      congress: '',
      chamber: '',
      billType: '',
      sponsor: '',
      dateRange: 'all',
      sort: 'updateDate+desc'
    });
    setCurrentPage(1);
    setHasSearched(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDateRangeText = () => {
    switch (filters.dateRange) {
      case 'week': return 'Past Week';
      case 'month': return 'Past Month';
      case 'year': return 'Past Year';
      case 'session': return 'Current Session';
      default: return 'All Time';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Search Congressional Bills</h1>
                <p className="text-sm text-gray-600 mt-1">Find bills, resolutions, and legislative actions</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/congress" className="text-gray-700 hover:text-blue-600 transition-colors">Congress</Link>
              <Link to="/members" className="text-gray-700 hover:text-blue-600 transition-colors">Members</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Main Search */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Search for Bills and Resolutions
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter keywords, bill numbers, or topics..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
                {Object.values(filters).some(v => v && v !== 'all') && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Congress</label>
                  <select
                    value={filters.congress}
                    onChange={(e) => handleFilterChange('congress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Congresses</option>
                    <option value="118">118th (2023-2025)</option>
                    <option value="117">117th (2021-2023)</option>
                    <option value="116">116th (2019-2021)</option>
                    <option value="115">115th (2017-2019)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chamber</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bill Type</label>
                  <select
                    value={filters.billType}
                    onChange={(e) => handleFilterChange('billType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="hr">House Bill</option>
                    <option value="s">Senate Bill</option>
                    <option value="hjres">House Joint Resolution</option>
                    <option value="sjres">Senate Joint Resolution</option>
                    <option value="hconres">House Concurrent Resolution</option>
                    <option value="sconres">Senate Concurrent Resolution</option>
                    <option value="hres">House Simple Resolution</option>
                    <option value="sres">Senate Simple Resolution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="year">Past Year</option>
                    <option value="session">Current Session</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sponsor</label>
                  <input
                    type="text"
                    value={filters.sponsor}
                    onChange={(e) => handleFilterChange('sponsor', e.target.value)}
                    placeholder="Sponsor name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="updateDate+desc">Newest First</option>
                    <option value="updateDate+asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Search Suggestions */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Quick searches:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'infrastructure',
                  'healthcare',
                  'climate change',
                  'tax reform',
                  'education',
                  'defense'
                ].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      setHasSearched(true);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Search Info */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
                  {data && (
                    <p className="text-gray-600 mt-1">
                      {data.pagination?.count || 0} results found
                      {searchQuery && ` for "${searchQuery}"`}
                      {data.searchCriteria && Object.values(data.searchCriteria).some(v => v) && (
                        <span> with filters applied</span>
                      )}
                    </p>
                  )}
                </div>
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
            </div>

            {loading && <LoadingSpinner message="Searching congressional database..." />}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-medium">Search Error</p>
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
                      onItemsPerPageChange={setItemsPerPage}
                    />
                  </>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No bills found</h3>
                    <p className="mt-2 text-gray-600">
                      Try adjusting your search terms or filters to find different results.
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={clearAll}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear all filters and start over
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Help Section */}
        {!hasSearched && (
          <div className="bg-blue-50 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">What you can search for:</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Bill numbers (e.g., "H.R. 1", "S. 2")</li>
                  <li>• Keywords and topics</li>
                  <li>• Sponsor names</li>
                  <li>• Committee names</li>
                  <li>• Bill titles or descriptions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Search examples:</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• "infrastructure spending"</li>
                  <li>• "climate change mitigation"</li>
                  <li>• "tax relief small business"</li>
                  <li>• "defense authorization"</li>
                  <li>• "healthcare reform"</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;