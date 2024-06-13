import React from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import socketIO from 'socket.io-client';
import DefaultPage from './Components/DefaultPage';
import GameRoom from './Components/GameRoom';
import { useState } from 'react';

const expressConnectURL="http://localhost:3001";
const socket=socketIO.connect(expressConnectURL,{
  transports: ['websocket']
});

const App=()=>{
  let [username,setUsername]=useState("");
  let [isNameSet,setIsNameSet]=useState(false);

  const formSubmit=(e)=>{
    e.preventDefault();
    setIsNameSet(true);
  }

  if(!isNameSet){
    return( 
      <div className='main-container'>
        <h1 className='app-title'>Tic-Tac-Toe</h1>
        <br />
        <br />
        <br />
        <form className='form' onSubmit={formSubmit}>
          <fieldset className='input-field'>
          <br />
          <legend>UserName</legend>
          <label className='name-label' htmlFor='user-name'>USERNAME: </label>
          <input className='name-input' id='user-name' type='text' onChange={(e)=>setUsername(e.target.value)} value={username} />
          <br />
          <br />
          <br />
          <input className='submit' type="submit" value="CONFIRM" />
          <br />
          <br />
          </fieldset>
        </form>
      </div>
    )
  }

  return(
    <Router>
      <Routes>
        <Route path='/' element={<DefaultPage socket={ socket } username={ username } />} />
        <Route path='/:roomID' element={<GameRoom socket={ socket } username={ username } />} />
      </Routes>
    </Router>
  )
}

export default App;