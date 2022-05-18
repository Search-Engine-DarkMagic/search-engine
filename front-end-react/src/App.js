import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import SearchEngineMain from "./pages/SearchEngineMain";
import SearchResult from "./pages/SearchResult";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
function App() {
  const [key, setKey] = useState('');
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchEngineMain />} />
        <Route path="/v1/search/:keyword&:filter" element={<SearchResult />} />
        <Route path="/v1/signup" element={<SignupPage />} />
        <Route path="/v1/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
