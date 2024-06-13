import React from "react";
import './GameRoom.css';
import Body2 from "./Body2";
import Sidebar2 from "./Sidebar2"; 

const GameRoom=({ socket, username })=>{
  return(
    <div className="app-container">
      <Sidebar2 socket={ socket } username={ username } />
      <div className="parent-container">
        <Body2 socket={ socket } username={ username } />
      </div>
    </div>
  )
}

export default GameRoom;