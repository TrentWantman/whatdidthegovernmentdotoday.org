import React from 'react';
import { Link } from 'react-router-dom';

const BillCard = ({ bill }) => {
  const getBillTypeLabel = (type) => {
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
    return types[type.toLowerCase()] || type.toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              {getBillTypeLabel(bill.type)}
            </span>
            <span className="text-gray-500 text-sm">
              {bill.congress}th Congress
            </span>
          </div>
          {bill.slug && !bill.slug.startsWith('unknown') && !bill.slug.startsWith('invalid') ? (
            <Link
              to={`/bill/${bill.slug}`}
              className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
            >
              {bill.number ? `${bill.type?.toUpperCase()} ${bill.number}` : bill.slug}
            </Link>
          ) : (
            <div className="text-lg font-bold text-gray-500 line-clamp-2">
              {bill.number ? `${bill.type?.toUpperCase()} ${bill.number}` : 'Bill details unavailable'}
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {bill.shortTitle || bill.title || 'No title available'}
      </p>

      {bill.latestAction && (
        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <p className="text-sm font-semibold text-gray-600 mb-1">Latest Action</p>
          <p className="text-sm text-gray-700">
            {bill.latestAction.text}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(bill.latestAction.actionDate)}
          </p>
        </div>
      )}

      {bill.sponsors && bill.sponsors.length > 0 && (
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span>
            Sponsored by: {bill.sponsors[0].firstName} {bill.sponsors[0].lastName}
          </span>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        {bill.slug && !bill.slug.startsWith('unknown') && !bill.slug.startsWith('invalid') ? (
          <Link
            to={`/bill/${bill.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
          >
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span className="text-gray-400 font-medium text-sm">
            Details unavailable
          </span>
        )}
        {bill.status && (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            bill.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {bill.status}
          </span>
        )}
      </div>
    </div>
  );
};

export default BillCard;