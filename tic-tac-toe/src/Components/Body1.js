import React from "react";
import './Body1.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Body1=({ socket, username })=>{
  const navigate=useNavigate();
  const [roomname,setRoomname]=useState("");
  const [roomID,setRoomID]=useState("");

  //close the application window upon click
  const logoutApp=()=>{
    window.open("about:blank", "_self");
    window.close();
  }

  //creating a room with ID = uppercase of socket.id
  const formSubmit1=(e)=>{
    e.preventDefault();
    socket.emit('newRoom',{ roomID: socket.id.toUpperCase(), roomname: roomname, username: username, socketID: socket.id });

    navigate("/"+socket.id.toUpperCase());
  }

  const formSubmit2=(e)=>{
    e.preventDefault();
    socket.emit('joinRoom',{ roomID: roomID, username: username, socketID: socket.id });

    navigate("/"+roomID);
  }

  return(
    <div className='body-container'>
      <header className='room-header'>
          <p>Create or Join a GameRoom</p>
          <button className='logout-app' onClick={logoutApp}>
              LOGOUT
          </button>
      </header>

      <div className="all-forms">
      <form className='form' onSubmit={formSubmit1}>
        <fieldset className='input-field'>
          <legend>Create GameRoom</legend>
          <br />
          <label className='room-label' htmlFor='room-name'>GAMEROOM NAME: </label>
          <input className='input-room' id='room-name' type='text' placeholder='Enter GameRoom name here...' onChange={(e)=>setRoomname(e.target.value)} value={roomname} />
          <br />
          <br />
          <br />
          <input className='submit' type="submit" value="CREATE ROOM" />
        </fieldset>
        </form>
        <br />
        <br />
        <br />
        <br />
        <form className='form' onSubmit={formSubmit2}>
        <fieldset className='input-field'>
            <legend>Join GameRoom</legend>
            <br />
            <label className='room-label' htmlFor='room-ID'>GAMEROOM ID: </label>
            <input className='input-id' id='room-ID' type='text' placeholder='Enter GameRoom ID here...' onChange={(e)=>setRoomID(e.target.value)} value={roomID} />
            <br />
            <br />
            <br />
            <input className='submit' type="submit" value="JOIN ROOM" />
        </fieldset>
        </form>
      </div>
    </div>
  )
}

export default Body1;