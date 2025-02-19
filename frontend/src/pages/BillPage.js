import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/BillPage.css';

function BillPage() {
  const { billSlug } = useParams();
  const [billData, setBillData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/congress/${billSlug}`)
      .then((res) => setBillData(res.data))
      .catch((err) => {
        console.error(err);
        setError('Failed to load bill details.');
      });
  }, [billSlug]);

  if (error) return <p className="error">{error}</p>;
  if (!billData) return <p className="loading">Loading...</p>;

  const { bill } = billData;

  return (
    <div className="bill-page">
      <h2>Bill Details</h2>

      {bill ? (
        <>
          <div className="bill-item-detail">
            <p><strong>Congress:</strong> {bill.congress}</p>
            <p><strong>Bill Number:</strong> {bill.number}</p>
            <p><strong>Chamber:</strong> {bill.originChamber}</p>
            <p><strong>Introduced Date:</strong> {bill.introducedDate}</p>
            <p><strong>Latest Action:</strong> {bill.latestAction?.text} on {bill.latestAction?.actionDate}</p>
          </div>

          <div className="sponsor-details">
            <h3 className="section-title">Sponsor Information</h3>
            {bill.sponsors?.length ? (
              bill.sponsors.map((sponsor, index) => (
                <div key={index}>
                  <p><strong>Name:</strong> {sponsor.fullName}</p>
                  <p><strong>Party:</strong> {sponsor.party}</p>
                  <p><strong>State:</strong> {sponsor.state}</p>
                  <p>
                    <strong>More Info:</strong>{' '}
                    <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
                      View Sponsor Profile
                    </a>
                  </p>
                </div>
              ))
            ) : (
              <p>No sponsors listed.</p>
            )}
          </div>

          <div className="bill-item-detail">
            <h3 className="section-title">Bill Text Versions</h3>
            {bill.textVersions?.titles?.length ? (
              <>
                {bill.textVersions.titles.map((title, idx) => (
                  <p key={idx}><strong>Title:</strong> {title}</p>
                ))}
                <p>
                  <strong>Read Full Text:</strong>{' '}
                  <a href={bill.textVersions.url} target="_blank" rel="noopener noreferrer">
                    View Bill Text
                  </a>
                </p>
              </>
            ) : (
              <p>No text versions available.</p>
            )}
          </div>
        </>
      ) : (
        <div className="bill-details">
          <p>No bill details available.</p>
        </div>
      )}

      {/* Show Raw JSON for Debugging */}
      <div className="bill-details">
        <h3 className="section-title">Raw API Data</h3>
        <pre>{JSON.stringify(billData, null, 2)}</pre>
      </div>
    </div>
  );
}

export default BillPage;
