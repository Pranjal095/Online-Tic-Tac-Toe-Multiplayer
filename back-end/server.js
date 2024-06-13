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

//create array of all users present in rooms
let members=[];

//updates on user activity to be logged to console
socketIO.on('connection',(socket)=>{
  socket.on('newRoom',async(data)=>{
    let room=new GameRoom({
      roomID: data.roomID,
      roomname: data.roomname,
      gamegrid: [[0,0,0],[0,0,0],[0,0,0]],
      moveNum: 0,
      isMatchOver: false
    })

    await room.save();
    socket.emit('joinResponse',{ roomname: room.roomname, gamegrid: room.gamegrid, moveNum: room.moveNum, isMatchOver: room.isMatchOver })

    //add to array of users present in rooms
    members.push( { username: data.username, roomID: room.roomID, socketID: data.socketID });
    socketIO.emit('memberResponse',members);
  })

  socket.on('joinRoom',async(data)=>{
    const existingRoom=await GameRoom.findOne({ roomID: data.roomID });

    if(!existingRoom){
      socketIO.emit('joinResponse',{ error: "Room with given ID does not exist."});
    }

    socket.emit('joinResponse',{ roomname: existingRoom.roomname, gamegrid: existingRoom.gamegrid, moveNum: existingRoom.moveNum, isMatchOver: existingRoom.isMatchOver });

    //add to array of users present in rooms
    members.push({ username: data.username, roomID: existingRoom.roomID, socketID: data.socketID });
    socketIO.emit('memberResponse',members);
  })

  socket.on('newMove',async(data)=>{
    const existingRoom=await GameRoom.findOne({ roomID: data.roomID });
    
    existingRoom.gamegrid=data.gamegrid;
    existingRoom.moveNum=data.moveNum;
    existingRoom.isMatchOver=data.isMatchOver;
    await existingRoom.save();

    socketIO.emit('gridUpdate',{ roomID: existingRoom.roomID, gamegrid: existingRoom.gamegrid, moveNum: existingRoom.moveNum, isMatchOver: existingRoom.isMatchOver });
  })

  socket.on('leaveResponse',()=>{
    members=members.filter((user)=>user.socketID !== socket.id);
    socketIO.emit('memberResponse',members);
  })

  socket.on('disconnect',()=>{
    members=members.filter((user)=>user.socketID !== socket.id);
    socketIO.emit('memberResponse',members);
  })
})

//setting up the http listener on env PORT (3001 by default)
http.listen(PORT,()=>{
  console.log("HTTP server listening on "+PORT);
})