import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CongressActions.css';

function CongressActions() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCongressActions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/congress/latest');
        setActions(response.data.bills || []);
      } catch (err) {
        console.error('API Error:', err.response ? err.response.data : err.message);
        setError('Failed to fetch congressional actions.');
      } finally {
        setLoading(false);
      }
    };

    fetchCongressActions();
  }, []);

  if (loading) return <p className="loading">Loading congressional actions...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="congress-actions">
      <h2>Recent Congressional Actions</h2>
      {actions.length === 0 ? (
        <p className="empty">No recent congressional actions found.</p>
      ) : (
        <ul className="actions-list">
          {actions.map((bill, index) => {
            // Use latestActionDate or fallback to introducedDate
            const actionDate = bill.latestActionDate || bill.introducedDate || 'No Date Available';
            return (
              <li key={index} className="bill-item">
                <h3>{bill.title || 'No Title Available'}</h3>
                <p>
                  <strong>Bill Number:</strong> {bill.number}
                </p>
                <p>
                  <strong>Latest Action Date:</strong> {actionDate}
                </p>
                <a
                  href={`https://www.congress.gov/bill/${bill.congress}-congress/${bill.type}/${bill.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-link"
                >
                  View on Congress.gov
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CongressActions;