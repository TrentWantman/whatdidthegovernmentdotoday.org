import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';

const BillDetailPage = () => {
  const { billSlug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');

  const { data: bill, loading, error } = useApi(`/api/congress/bill/${billSlug}`);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading bill details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Bill</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBillTypeFullName = (type) => {
    const types = {
      hr: 'House Resolution',
      s: 'Senate Bill',
      hjres: 'House Joint Resolution',
      sjres: 'Senate Joint Resolution',
      hconres: 'House Concurrent Resolution',
      sconres: 'Senate Concurrent Resolution',
      hres: 'House Simple Resolution',
      sres: 'Senate Simple Resolution'
    };
    return types[type?.toLowerCase()] || type?.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="text-gray-400">/</span>
              <Link to="/congress" className="text-gray-500 hover:text-gray-700">Congress</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{billSlug}</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Bill Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                    {getBillTypeFullName(bill?.type)}
                  </span>
                  <span className="text-blue-100">
                    {bill?.congress}th Congress
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  {bill?.type?.toUpperCase()} {bill?.number}
                </h1>
                <p className="text-blue-100 text-lg">
                  {bill?.title || 'No title available'}
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-500">Introduced</p>
              <p className="font-semibold text-gray-900">
                {formatDate(bill?.introducedDate)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-500">Latest Action</p>
              <p className="font-semibold text-gray-900">
                {formatDate(bill?.latestAction?.actionDate)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-500">Sponsor</p>
              <p className="font-semibold text-gray-900">
                {bill?.sponsors?.[0] ?
                  `${bill.sponsors[0].firstName} ${bill.sponsors[0].lastName}` :
                  'N/A'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-500">Cosponsors</p>
              <p className="font-semibold text-gray-900">
                {bill?.cosponsors?.length || 0}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              {['summary', 'actions', 'text', 'sponsors', 'committees'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill Summary</h3>
                  {bill?.summaries?.length > 0 ? (
                    <div className="space-y-4">
                      {bill.summaries.map((summary, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">
                            {summary.versionCode} - {formatDate(summary.actionDate)}
                          </p>
                          <div
                            className="text-gray-800 prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: summary.text }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No summary available for this bill.</p>
                  )}
                </div>

                {bill?.latestAction && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Latest Action</h3>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                      <p className="text-gray-800">{bill.latestAction.text}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(bill.latestAction.actionDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Legislative Actions</h3>
                {bill?.actions?.length > 0 ? (
                  <div className="space-y-3">
                    {bill.actions.map((action, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-24 text-sm text-gray-500">
                          {formatDate(action.actionDate)}
                        </div>
                        <div className="flex-grow">
                          <p className="text-gray-800">{action.text}</p>
                          {action.actionCode && (
                            <span className="inline-block mt-1 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                              {action.actionCode}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No actions recorded for this bill.</p>
                )}
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Bill Text</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-gray-800">
                    Full bill text is available on Congress.gov
                  </p>
                  <a
                    href={bill?.url || `https://www.congress.gov/bill/${bill?.congress}th-congress/${bill?.type?.toLowerCase()}/${bill?.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800"
                  >
                    View on Congress.gov
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'sponsors' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Sponsors & Cosponsors</h3>
                {bill?.sponsors?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Primary Sponsor</h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-semibold text-gray-900">
                        {bill.sponsors[0].firstName} {bill.sponsors[0].lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {bill.sponsors[0].party} - {bill.sponsors[0].state}
                      </p>
                    </div>
                  </div>
                )}

                {bill?.cosponsors?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Cosponsors ({bill.cosponsors.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {bill.cosponsors.map((cosponsor, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900">
                            {cosponsor.firstName} {cosponsor.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {cosponsor.party} - {cosponsor.state}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'committees' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Committee Information</h3>
                {bill?.committees?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bill.committees.map((committee, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold text-gray-900">{committee.name}</p>
                        {committee.chamber && (
                          <p className="text-sm text-gray-600 capitalize">{committee.chamber}</p>
                        )}
                        {committee.activities && (
                          <p className="text-sm text-gray-500 mt-1">
                            Activities: {committee.activities.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No committee information available.</p>
                )}
              </div>
            )}
          </div>

          {/* Related Bills */}
          {bill?.relatedBills?.length > 0 && (
            <div className="bg-gray-50 p-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Bills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bill.relatedBills.map((related, index) => (
                  <Link
                    key={index}
                    to={`/bill/${related.congress}-${related.type?.toLowerCase()}-${related.number}`}
                    className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <p className="font-medium text-blue-600 hover:text-blue-800">
                      {related.type?.toUpperCase()} {related.number}
                    </p>
                    <p className="text-sm text-gray-600">{related.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BillDetailPage;