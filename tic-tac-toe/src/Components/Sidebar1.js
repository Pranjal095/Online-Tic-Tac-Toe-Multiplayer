import React from "react";
import './Sidebar1.css';
import userIcon from '../user-icon.jpg'

const Sidebar1=({ username })=>{
	return(
    <div className="sidebar-container">
      <h1 className="app-name">Tic-Tac-Toe</h1>
      <h3 className="profile-heading">Profile</h3>
      <div className="view-profile">
        <img className='user-icon' src={userIcon} alt='User Icon' />
      </div>
      <h3 className="sidebar-heading">{username}</h3>
    </div>
	)
}

export default Sidebar1;