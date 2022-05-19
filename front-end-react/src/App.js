import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import SearchEngineMain from "./pages/SearchEngineMain";
import SearchResult from "./pages/SearchResult";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import axios from 'axios';

function App() {
  
  const [nickName, setNickName] = useState("");

  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:4000/v1/userinfo',
      withCredentials: true,
  }).then(function (response) {
    setNickName(response.data.message.nickName);

  })
  .catch(function (error) {
    if (error.response) {
      console.log(error);
    }

  })
     
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchEngineMain nickName={nickName} setNickName={setNickName}/>} />
        <Route path="/v1/search/:keyword&:filter" element={<SearchResult />} />
        <Route path="/v1/signup" element={<SignupPage />} />
        <Route path="/v1/login" element={<LoginPage setNickName={setNickName} nickName={nickName}/>} />
      </Routes>
    </Router>
  );
}

export default App;
