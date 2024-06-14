import React from "react";
import './Body2.css';
import { useNavigate } from 'react-router-dom';
import blankSquare from '../blank-square.png';
import crossIcon from '../tic-tac-toe-cross.png';
import circleIcon from '../tic-tac-toe-circle.png';
import { useState, useEffect } from "react";

const Body2=({ username, socket })=>{
  const [display,setDisplay]=useState("Turn belongs to Team Cross");
  const [grid,setGrid]=useState([[0,0,0],[0,0,0],[0,0,0]]);
  const [roomname,setRoomname]=useState("");
  const [isMatchOver,setIsMatchOver]=useState(false);

  //get the roomID using the current webpage url
  const URL=window.location.href;
  const roomID=URL.split("/")[4];

  useEffect(()=>{
    socket.on('joinResponse',(data)=>{
      setRoomname(data.roomname);
      setGrid(data.gamegrid);
      setIsMatchOver(data.isMatchOver);
      setDisplay(data.displayMessage);
    })

    socket.on('gridUpdate',(data)=>{
      if(data.roomID===roomID){
        console.log(data);
        setGrid(data.gamegrid);
        setIsMatchOver(data.isMatchOver);
        setDisplay(data.displayMessage);
      }
    })
  },[socket,roomID])
  
  const navigate=useNavigate();

  const leaveChat=()=>{
    socket.emit('leaveResponse',{ roomID: roomID });
    navigate("/");
  }

  const handleClick=(row,col)=>{
    socket.emit("newMove",{ roomID: roomID, rowNum: row, colNum: col, toReset: false, socketID: socket.id });
    console.log(socket.id);
  }

  const resetGrid=()=>{
    socket.emit("newMove",{ roomID: roomID, toReset: true, socketID: socket.id });
  }

  return(
    <div className='body-container'>
      <header className='room-header'>
        <p>{roomname}: {roomID}</p>
        <button className='leave-chat' onClick={leaveChat}>
          LEAVE GAME
        </button>
      </header>

      <h3 className="turn">{display}</h3>
      {
        isMatchOver ?
        <button className="reset" onClick={resetGrid}>RESET GRID</button>
        :
        <span />
      }
      <div className="display-game">
        <div id="tictactoe">
          <div className="box" id="box1" onClick={()=>handleClick(0,0)}>
            {
            grid[0][0]===0 ?
            <img src={blankSquare} alt="blank" />
            :
            grid[0][0]===1 ?
            <img src={crossIcon} alt="cross" />
            :
            <img src={circleIcon} alt="circle" />
            }
          </div>
          <div className="box" id="box2" onClick={()=>handleClick(0,1)}>
            {
            grid[0][1]===0 ?
            <img src={blankSquare} alt="blank" />
            :
            grid[0][1]===1 ?
            <img src={crossIcon} alt="cross" />
            :
            <img src={circleIcon} alt="circle" />
            }
          </div>
          <div className="box" id="box3" onClick={()=>handleClick(0,2)}>
            {
            grid[0][2]===0 ?
            <img src={blankSquare} alt="blank" />
            :
            grid[0][2]===1 ?
            <img src={crossIcon} alt="cross" />
            :
            <img src={circleIcon} alt="circle" />
            }
          </div>
          <div className="box" id="box4" onClick={()=>handleClick(1,0)}>
            {
            grid[1][0]===0 ?
            <img src={blankSquare} alt="blank" />
            :
            grid[1][0]===1 ?
            <img src={crossIcon} alt="cross" />
            :
            <img src={circleIcon} alt="circle" />
            }
          </div>
          <div className="box" id="box5" onClick={()=>handleClick(1,1)}>
            {
            grid[1][1]===0 ?
            <img src={blankSquare} alt="blank" />
            :
            grid[1][1]===1 ?
            <img src={crossIcon} alt="cross" />
            :
            <img src={circleIcon} alt="circle" />
            }
          </div>
          <div className="box" id="box6" onClick={()=>handleClick(1,2)}>
          {
            grid[1][2]===0 ?
            <img src={blankSquare} alt="blank" />
            :
            grid[1][2]===1 ?
            <img src={crossIcon} alt="cross" />
            :
            <img src={circleIcon} alt="circle" />
            }
          </div>
          <div className="box" id="box7" onClick={()=>handleClick(2,0)}>
          {
            grid[2][0]===0 ?
            <img src={blankSquare} alt="blank" />
            :
            grid[2][0]===1 ?
            <img src={crossIcon} alt="cross" />
            :
            <img src={circleIcon} alt="circle" />
            }
          </div>
          <div className="box" id="box8" onClick={()=>handleClick(2,1)}>
            {
            grid[2][1]===0 ?
            <img src={blankSquare} alt="blank" />
            :
            grid[2][1]===1 ?
            <img src={crossIcon} alt="cross" />
            :
            <img src={circleIcon} alt="circle" />
            }
          </div>
          <div className="box" id="box9" onClick={()=>handleClick(2,2)}>
            {
            grid[2][2]===0 ?
            <img src={blankSquare} alt="blank" />
            :
            grid[2][2]===1 ?
            <img src={crossIcon} alt="cross" />
            :
            <img src={circleIcon} alt="circle" />
            }
          </div> 
        </div>
      </div>
    </div>
  )
}

export default Body2;