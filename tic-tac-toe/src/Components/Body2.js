import React from "react";
import './Body2.css';
import { useNavigate } from 'react-router-dom';
import blankSquare from '../blank-square.png';
import crossIcon from '../tic-tac-toe-cross.png';
import circleIcon from '../tic-tac-toe-circle.png';
import { useState, useEffect } from "react";

const Body2=({ username, socket })=>{
  const [moveNum,setMoveNum]=useState(0);
  const [playerTurn,setPlayerTurn]=useState("Turn belongs to Team Cross");
  const [grid,setGrid]=useState([[0,0,0],[0,0,0],[0,0,0]]);
  const [roomname,setRoomname]=useState("");
  const [isMatchOver,setIsMatchOver]=useState(false);
  let [users,setUsers]=useState([]);

  //array of members who are in Team Cross
  let crosses=[];
  //array of members who are in Team Circle
  let circles=[];

  //get the roomID using the current webpage url
  const URL=window.location.href;
  const roomID=URL.split("/")[4];

  useEffect(()=>{
    const checkWin=(value)=>{
      if ((grid[0][0] === value && grid[1][1] === value && grid[2][2] === value) || (grid[0][2] === value && grid[1][1] === value && grid[2][0] === value) || (grid[0][0] === value && grid[0][1] === value && grid[0][2] === value) || (grid[1][0] === value && grid[1][1] === value && grid[1][2] === value) || (grid[2][0] === value && grid[2][1] === value && grid[2][2] === value) || (grid[0][0] === value && grid[1][0] === value && grid[2][0] === value) || (grid[0][1] === value && grid[1][1] === value && grid[2][1] === value) || (grid[0][2] === value && grid[1][2] === value && grid[2][2] === value)){
        return true;
      }
      else{
        return false;
      }
    }

    if(checkWin(1)){
      setPlayerTurn("Team Cross wins!");
      setIsMatchOver(true);
    }

    else if(checkWin(2)){
      setPlayerTurn("Team Circle wins!");
      setIsMatchOver(true);
    }

    else if(moveNum===9){
      setPlayerTurn("It's a draw!");
      setIsMatchOver(true);
    }

    else{
      //deciding the turn based on moveNum
      if(moveNum%2 === 0){
        setPlayerTurn("Turn belongs to Team Cross");
      }
      else{
        setPlayerTurn("Turn belongs to Team Circle");
      }
    }

    socket.on('joinResponse',(data)=>{
      setRoomname(data.roomname);
      setGrid(data.gamegrid);
      setMoveNum(data.moveNum);
    })

    socket.on('memberResponse',(data)=>setUsers(data));

    socket.on('gridUpdate',(data)=>{
      if(data.roomID===roomID){
        setGrid(data.gamegrid);
        setMoveNum(data.moveNum);
        setIsMatchOver(data.isMatchOver);
      }
    })
  },[socket,roomID,moveNum,grid])

  //access only those users which are in the same group
  users=users.filter((user)=>user.roomID === roomID);
  crosses=users.filter((crossMember,index)=>index%2 === 0);
  circles=users.filter((circleMember,index)=>index%2 !== 0);
  
  const navigate=useNavigate();

  const leaveChat=()=>{
    socket.emit('leaveResponse');
    navigate("/");
  }

  const handleClick=(row,col)=>{
    if(moveNum%2 === 0){
      //check whether user is making a valid move
      if(crosses.some((crossMember)=>crossMember.username === username) && !grid[row][col] && !isMatchOver){
        const newGrid=[...grid];
        newGrid[row][col]=1;
        socket.emit("newMove",{ roomID: roomID, gamegrid: newGrid, moveNum: moveNum+1, isMatchOver: isMatchOver });
      }
      else if(isMatchOver){
        setPlayerTurn("Match is over! Reset the grid to start a new one...");
      }
      else if(grid[row][col]){
        setPlayerTurn("Pick a blank square...");
      }
      else{
        setPlayerTurn("Wait for your turn...");
      }
    }
    else{
      //check whether user is making a valid move
      if(circles.some((circleMember)=>circleMember.username === username) && !grid[row][col]){
        const newGrid=[...grid];
        newGrid[row][col]=2;
        socket.emit("newMove",{ roomID: roomID, gamegrid: newGrid, moveNum: moveNum+1, isMatchOver: isMatchOver });
      }
      else if(isMatchOver){
        setPlayerTurn("Match is over! Reset the grid to start a new one...");
      }
      else if(grid[row][col]){
        setPlayerTurn("Pick a blank square...");
      }
      else{
        setPlayerTurn("Wait for your turn...");
      }
    }
  }

  const resetGrid=()=>{
    const newGrid=[[0,0,0],[0,0,0],[0,0,0]];
    socket.emit("newMove",{ roomID: roomID, gamegrid: newGrid, moveNum: 0, isMatchOver: false });
  }

  return(
    <div className='body-container'>
      <header className='room-header'>
        <p>{roomname}: {roomID}</p>
        <button className='leave-chat' onClick={leaveChat}>
          LEAVE GAME
        </button>
      </header>

      <h3 className="turn">{playerTurn}</h3>
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