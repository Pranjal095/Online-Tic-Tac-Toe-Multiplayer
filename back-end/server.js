const express=require('express');
const app=express();
const mongoose=require('mongoose');
const http=require('http').Server(app);
const cors=require('cors');

const reactAppURL="http://localhost:3000";
const PORT=process.env.PORT || 3001;

//connecting to the MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/griddb");

//fetching the mongoose model for GameRoom
const GameRoom=require('./GameRoom.js');

//incorporating the cors functionality
app.use(cors());

//configuring the socket.io module
const socketIO=require('socket.io')(http,{
  cors:{
    origin: reactAppURL
  }
});

//updates on user activity to be logged to console
socketIO.on('connection',(socket)=>{
  socket.on('newRoom',async(data)=>{
    let room=new GameRoom({
      roomID: data.roomID,
      roomname: data.roomname,
      gamegrid: [[0,0,0],[0,0,0],[0,0,0]],
      moveNum: 0,
      isMatchOver: false,
      members: [{ username: data.username, socketID: data.socketID, teamName: "Cross" }],
      displayMessage: "Turn belongs to Team Cross"
    })

    await room.save();
    socket.emit('joinResponse',{ roomname: room.roomname, gamegrid: room.gamegrid, moveNum: room.moveNum, isMatchOver: room.isMatchOver, displayMessage: room.displayMessage });

    socketIO.emit('memberResponse',{ roomID: room.roomID, members: room.members });
  })

  socket.on('joinRoom',async(data)=>{
    const existingRoom=await GameRoom.findOne({ roomID: data.roomID });

    if(!existingRoom){
      socketIO.emit('joinResponse',{ error: "Room with given ID does not exist."});
    }

    existingRoom.members.push({ username: data.username, socketID: data.socketID, teamName: existingRoom.members[existingRoom.members.length-1].teamName==="Cross" ? "Circle" : "Cross" })

    await existingRoom.save();

    socket.emit('joinResponse',{ roomname: existingRoom.roomname, gamegrid: existingRoom.gamegrid, moveNum: existingRoom.moveNum, isMatchOver: existingRoom.isMatchOver, displayMessage: existingRoom.displayMessage });

    socketIO.emit('memberResponse',{ roomID: existingRoom.roomID, members: existingRoom.members });
  })

  const checkWin=(value,grid)=>{
    if ((grid[0][0] === value && grid[1][1] === value && grid[2][2] === value) || (grid[0][2] === value && grid[1][1] === value && grid[2][0] === value) || (grid[0][0] === value && grid[0][1] === value && grid[0][2] === value) || (grid[1][0] === value && grid[1][1] === value && grid[1][2] === value) || (grid[2][0] === value && grid[2][1] === value && grid[2][2] === value) || (grid[0][0] === value && grid[1][0] === value && grid[2][0] === value) || (grid[0][1] === value && grid[1][1] === value && grid[2][1] === value) || (grid[0][2] === value && grid[1][2] === value && grid[2][2] === value)){
      return true;
    }
    else{
      return false;
    }
  }

  socket.on('newMove',async(data)=>{
    const existingRoom=await GameRoom.findOne({ roomID: data.roomID });
    let grid=existingRoom.gamegrid;
    let moveNum=existingRoom.moveNum;
    let isMatchOver=existingRoom.isMatchOver;
    let user=existingRoom.members.filter((user)=>user.socketID === data.socketID);
    //get only element from array
    user=user[0];
    const row=data.rowNum;
    const col=data.colNum;
    let displayMessage=existingRoom.displayMessage;

    if(!data.toReset){
      if(moveNum%2 === 0){
        //check whether user is making a valid move
        if(user.teamName==="Cross" && !grid[row][col] && !isMatchOver){
          grid[row][col]=1;
          moveNum++;
        }
      }
      else{
        //check whether user is making a valid move
        if(user.teamName==="Circle" && !grid[row][col] && !isMatchOver){
          grid[row][col]=2;
          moveNum++;
        }
      }
    }
    //reset the grid
    else{
      grid=[[0,0,0],[0,0,0],[0,0,0]];
      moveNum=0;
      isMatchOver=false;
      displayMessage="Turn belongs to Team Cross";
    }

    //if first player wins
    if(checkWin(1,grid)){
      displayMessage="Team Cross wins!";
      isMatchOver=true;
    }

    //if second player wins
    else if(checkWin(2,grid)){
      displayMessage="Team Circle wins!";
      isMatchOver=true;
    }

    //if it's a draw
    else if(moveNum===9){
      displayMessage="It's a draw!";
      isMatchOver=true;
    }

    else{
      //deciding the turn based on moveNum iff moveNum has changed
      if(moveNum!==existingRoom.moveNum){
        if(moveNum%2 === 0){
          displayMessage="Turn belongs to Team Cross";
        }
        else{
          displayMessage="Turn belongs to Team Circle";
        }
      }
    }
    
    existingRoom.gamegrid=grid;
    existingRoom.moveNum=moveNum;
    existingRoom.isMatchOver=isMatchOver;
    existingRoom.displayMessage=displayMessage;
    await existingRoom.save();

    socketIO.emit('gridUpdate',{ roomID: existingRoom.roomID, gamegrid: existingRoom.gamegrid, isMatchOver: existingRoom.isMatchOver, displayMessage: existingRoom.displayMessage });
  })

  socket.on('leaveResponse',async(data)=>{
    const existingRoom=await GameRoom.findOne({ roomID: data.roomID });
    existingRoom.members=existingRoom.members.filter((user)=>user.socketID !== socket.id);
    await existingRoom.save();
    socketIO.emit('memberResponse',{ roomID: existingRoom.roomID, members: existingRoom.members });
  })

  socket.on('disconnect',async()=>{
    const existingRoom=await GameRoom.findOne({
      members: { $elemMatch: { socketID: socket.id } }
    });
    if(existingRoom){
      existingRoom.members=existingRoom.members.filter((user)=>user.socketID !== socket.id);
      await existingRoom.save();
      socketIO.emit('memberResponse',{ roomID: existingRoom.roomID, members: existingRoom.members });
    }
  })
})

//setting up the http listener on env PORT (3001 by default)
http.listen(PORT,()=>{
  console.log("HTTP server listening on "+PORT);
})