const mongoose=require('mongoose');

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
  }
})

const GameRoom=mongoose.model("GameRoom",gameRoomSchema);
module.exports=GameRoom;