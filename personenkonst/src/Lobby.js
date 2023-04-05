import './Lobby.css';
import React, { useState, useEffect } from 'react';
const WebSocket = require('ws');

function Lobby({pop,show, author, book, code,joiner,handleclose}) {
    const [users,setUsers] = useState([]);
    console.log(show);
    if (!show) return null;


  /*  const socket = new WebSocket('ws://localhost:8080');

    socket.addEventListener('open', (event) => {
        // Handle connection opening
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'user-joined') {
            // Handle new user joining the lobby
            const user = data.user;
            users[user.id] = user;
            updateUserList();
        } else if (data.type === 'user-left') {
            // Handle user leaving the lobby
            const userId = data.userId;
            delete users[userId];
            updateUserList();
        }
    });

    socket.addEventListener('close', (event) => {
        console.log('Disconnected from server');
        // Update UI to indicate that the connection has been closed
    });

    function updateUserList() {
        const userList = document.querySelector('#user-list');
        userList.innerHTML = '';

        Object.values(users).forEach((user) => {
            const li = document.createElement('li');
            li.innerText = user.name;
            userList.appendChild(li);
        });
    }

   */


// Generate random 6 digit pin for lobby
    let lobbyPin = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Lobby pin:', lobbyPin);

    return (
        <div className={"lobby"}>
            <div className="container">
                <div className="left-half">
                    <h1>Raum beitreten: </h1>
                    <fieldset className={'numbers'} >{lobbyPin}</fieldset>
                    <h2>Personenkonstellation</h2>
                    <p>Autor: {author}</p>
                    <p>Lektüre: {book}</p>

                </div>
                <div className="right-half" >
                    <h3 className="joiningUsers" >  Personen beigetreten: </h3>
                    <a>beigetretene Benutzer: </a>
                    <ul>
                        {joiner}
                    </ul>
                    <button className={"close"} onClick={handleclose} >x</button>
                </div>
            </div>
        </div>
    )
}

export default Lobby;
