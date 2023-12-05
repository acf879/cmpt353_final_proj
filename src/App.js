import React from 'react';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBarFixed from "./components/NavBarFixed"; // use mysql 5.7 <- this is what caused error before

import PostChannel from "./components/PostChannel";
import LandingPage from './components/LandingPage';
import Channels from './components/Channels';
import Signup from './components/Signup.js';
import Login from './components/Login.js';
import ChannelPage from './components/ChannelPage.js';
import RepliesPage from './components/RepliesPage.js';
import SearchPage from './components/SearchPage.js';

function App() {
  try {
    var userName;
    var cookie = document.cookie
    cookie.split(";").forEach((item) => {
        if ((item.split("=")[0].split(" ")[1] === "username") || (item.split("=")[0] === "username")) {
            userName = item.split("=")[1];
        }
    });

  } catch (err) {
    
  }
  return (
  <>
  <div className="App">
    <div className="App-header">
      <div className='NavBar'><NavBarFixed /></div>
    </div>
    <div className='Page'>
    <Router>
      <Routes>
        <Route exact path='/' element={<LandingPage/>}/>
        <Route path='/channels' element={<Channels />}/>
        <Route path='/post_channel' element={<PostChannel />}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path="/channels/:channelTitle/message" element={<ChannelPage />}/>
        <Route path="/channels/:channelTitle/message/:post_title/replies" element={<RepliesPage />}/>
        <Route path="/search/:search_terms" element={<SearchPage/>}/> // make this a search page instead of landing page and query database for search
        <Route path="/search" element={<SearchPage/>}/>
      </Routes>
    </Router>
    </div>
  </div>
  </>);
}

export default App;