import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import SearchEngineMain from "./pages/SearchEngineMain";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchEngineMain />} />
      </Routes>
    </Router>
  );
}

export default App;
