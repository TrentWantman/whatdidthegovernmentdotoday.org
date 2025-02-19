import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/CongressActions.css';

function CongressActions() {
  const [actions, setActions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store offset for pagination
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const fetchCongressActions = async () => {
    setLoading(true);
    setError(null);
    try {
      // GET /api/congress/paginated?offset=X&limit=Y
      const response = await axios.get('http://localhost:5000/api/congress/paginated', {
        params: { offset, limit },
      });
      setActions(response.data.bills || []);
      setPagination(response.data.pagination || {});
    } catch (err) {
      console.error('API Error:', err.message);
      setError('Failed to fetch congressional actions.');
    } finally {
      setLoading(false);
    }
  };

  // refetch whenever offset changes
  useEffect(() => {
    fetchCongressActions();
  }, [offset]);

  if (loading) return <p className="loading">Loading congressional actions...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="congress-actions">
      <h2>Congressional Actions (Page {Math.floor(offset / limit) + 1})</h2>
      {pagination && (
        <p className="pagination-info">
          Showing results {offset + 1} to {offset + limit} of {pagination.count || 'unknown'} bills
        </p>
      )}

      {actions.length === 0 ? (
        <p className="empty">No actions found.</p>
      ) : (
        <ul className="actions-list">
          {actions.map((bill) => {
            // Build slug: e.g. "118-hr-146"
            const congress = bill.congress || '???';
            const rawType = bill.type || '???';
            const number = bill.number || '???';

            const slug = `${congress}-${rawType}-${number}`;

            return (
              <li key={slug} className="bill-item">
                <h3>{bill.title || 'No Title Available'}</h3>
                <p><strong>Congress:</strong> {bill.congress}th</p>
                <p><strong>Bill Number:</strong> {bill.type} {bill.number}</p>
                <p><strong>Chamber:</strong> {bill.originChamber || 'Unknown'}</p>
                <p><strong>Latest Action:</strong> {bill.latestAction?.text || 'No action available'}</p>
                <p><strong>Action Date:</strong> {bill.latestAction?.actionDate || 'N/A'}</p>
                <p><strong>Record Last Updated:</strong> {bill.updateDate || 'N/A'}</p>

                {/* Link to official site */}
                <a
                  href={`https://www.congress.gov/bill/${bill.congress}-congress/${(bill.type||'').toLowerCase()}/${bill.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-link"
                >
                  View on Congress.gov
                </a>

                {/* Link to local BillPage */}
                <Link to={`/bill/${slug}`} className="view-link">
                  View Details on BillPage
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* Simple pagination controls */}
      <div className="pagination-controls">
        <button
          onClick={() => setOffset(Math.max(offset - limit, 0))}
          disabled={offset === 0}
          className="pagination-button"
        >
          ← Previous
        </button>
        <button
          onClick={() => setOffset(offset + limit)}
          className="pagination-button"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default CongressActions;
