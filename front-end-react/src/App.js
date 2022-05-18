import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import SearchEngineMain from "./pages/SearchEngineMain";
import SearchResult from "./pages/SearchResult";
function App() {
  const [key, setKey] = useState('');
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchEngineMain />} />
        <Route path="/v1/search/:keyword&:filter" element={<SearchResult />} />
      </Routes>
    </Router>
  );
}

export default App;
