import React from 'react';
import './index.css';
import './CongressActions.css';
import CongressActions from './CongressActions';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>What Did the Government Do?</h1>
        <p>Tracking the latest congressional actions</p>
      </header>
      <main>
        <CongressActions />
      </main>
      <footer>
        <p>&copy; 2025 WhatDidTheGovernmentDo.org</p>
      </footer>
    </div>
  );
}

export default App;