import React from "react";
import './DefaultPage.css';
import Sidebar1 from "./Sidebar1";
import Body1 from "./Body1";

const DefaultPage=({ socket, username })=>{
  return(
    <div className='app-container'>
      <Sidebar1 username={ username } />
      <div className='parent-container'>
        <Body1 socket={ socket } username={ username } />
      </div>
    </div>
  )
}

export default DefaultPage;