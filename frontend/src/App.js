import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CongressActions from './components/CongressActions';
import BillPage from './pages/BillPage';
import './styles/App.css'; 

function App() {
  return (
    <div className="App">
      <h1>What Did The Government Do?</h1>
      <Routes>
        {/* Home page -> CongressActions list */}
        <Route path="/" element={<CongressActions />} />

        {/* Bill detail page -> /bill/:billSlug (e.g. /bill/118-hr-146) */}
        <Route path="/bill/:billSlug" element={<BillPage />} />
      </Routes>
    </div>
  );
}

export default App;
