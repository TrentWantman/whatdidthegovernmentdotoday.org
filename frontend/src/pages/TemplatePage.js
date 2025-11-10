import React from 'react';
import '../styles/TemplatePage.css';

function TemplatePage() {
  return (
    <div className="template-page">
      <header className="header">
        <div className="header-left">
          <button className="menu-button">☰</button>
        </div>
        <div className="header-center">
        <h1>?</h1>
        </div>
        <div className="header-right">
          {/* You can add additional header items here if needed */}
        </div>
      </header>
      <main className="content">
        <h1>What Did The Government Do Today?</h1>
        <p>This is where you'll see updates and actions from various government bodies.</p>
      </main>
      <footer className="footer">
        <p>&copy; 2025 Your Organization Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default TemplatePage;