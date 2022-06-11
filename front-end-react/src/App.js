import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import SearchEngineMain from "./pages/SearchEngineMain";
import SearchResult from "./pages/SearchResult";
import SearchResultImg from "./pages/SearchResultImg";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import History from "./pages/History";
import Fav from "./pages/Fav";
import Profile from "./pages/Profile";
import AddFav from "./pages/AddFav";
import axios from 'axios';

function App() {
  
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:4000/v1/userinfo',
      withCredentials: true,
  }).then(function (response) {
    setNickName(response.data.message.nickName);
    
    setEmail(response.data.message.email);
    
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
        <Route path="/" element={<SearchEngineMain nickName={nickName} setNickName={setNickName} email={email} />} />
        <Route path="/v1/search/:keyword&:filter" element={<SearchResult nickName={nickName} email={email}/>} />
        <Route path="/v1/searchImg/:keyword&:filter" element={<SearchResultImg nickName={nickName} email={email}/>} />
        <Route path="/v1/signup" element={<SignupPage />} />
        <Route path="/v1/login" element={<LoginPage setNickName={setNickName} nickName={nickName}/>} />
        <Route path="/v1/history" element={<History nickName={nickName}/>} />
        <Route path="/v1/fav" element={<Fav nickName={nickName} email={email}/>} />
        <Route path="/v1/test" element={<AddFav />}/>
        <Route path="/v1/profile" element={<Profile nickName={nickName} email={email}/>} />
      </Routes>
    </Router>
  );
}

export default App;
