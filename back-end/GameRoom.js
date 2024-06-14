const mongoose=require('mongoose');

const memberInfoSchema=new mongoose.Schema({
  username:{
    type: String,
    required: true
  },

  socketID:{
    type: String,
    required: true
  },

  teamName:{
    type: String,
    required: true
  }
})

//defining the schema and model for the gameroom collection
const gameRoomSchema=new mongoose.Schema({
  roomID:{
    type: String,
    required: true
  },

  roomname:{
    type: String,
    required: true
  },

  gamegrid:{
    type: [[Number]],
    required: true
  },

  moveNum:{
    type: Number,
    required: true
  },

  isMatchOver:{
    type: Boolean,
    required: true
  },

  members:{
    type: [memberInfoSchema],
    required: true
  },

  displayMessage:{
    type: String,
    required: true
  }
})

const GameRoom=mongoose.model("GameRoom",gameRoomSchema);
module.exports=GameRoom;