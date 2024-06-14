import React from "react";
import './Sidebar2.css';
import { useState,useEffect } from 'react';

const Sidebar2=({ socket, username })=>{
  let [users,setUsers]=useState([]);

  //get the roomID using the current webpage url
  const URL=window.location.href;
  const roomID=URL.split("/")[4];

  useEffect(()=>{
    socket.on('memberResponse',(data)=>{
      if(data.roomID===roomID){
        setUsers(data.members)
      }
    });
  },[socket,users,roomID]);

  return(
    <div className="sidebar-container">
      <h1 className="app-name">Tic-Tac-Toe</h1>
      <h3 className="sidebar-heading">{username}</h3>
      <h3 className="online-heading">Members Online:</h3>
      <div className="online-members">
        {users.map((user)=>(
          <p key={user.socketID}>
            {
              user.teamName === "Cross" ?
              user.username+": Team Cross"
              :
              user.username+": Team Circle"
            }
          </p>
        ))}
      </div>
    </div>
  )
}

export default Sidebar2;