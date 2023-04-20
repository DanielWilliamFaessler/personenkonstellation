import './Lobby.css';
import React, { useState, useEffect } from 'react';
import Tool from './Tool';
import ColoredRect from './App';
import io from "socket.io-client";


const socket = io('http://localhost:5000');


function Lobby({room, pop,show, author, book,handleclose}) {
    const [clients, setClients] = useState([]);
    const [tool, setTool] = useState(false);
    const [pin, setPin] = useState(false);

    useEffect(() => {
        socket.on('lobby_created', ({ pin }) => {
            setPin(pin);
        });

        //get clients
        socket.on('room_joined', ({ clients }) => {
            setClients(clients);
        });

        // Clean up the socket listener when the component unmounts
        return () => {
            socket.off('lobby_created');
        };

    }, []);

    const handleStartRoom = () => {
       socket.emit('start_room', { pin });
        setTool(true);
    };

    // Listen for "room_started" event
    socket.on('room_started', (pin) => {
        // Redirect all users in the room to the tool component
        window.location.href = `/App.js?pin=${pin}`;
    });

    if (!show) return null;

    return (
        <div className="lobby">
            {tool ? (
                <ColoredRect pin={pin} />
            ) : (
                <div className="container">
                    <div className="left-half">
                        <h1>Raum beitreten: </h1>
                        <fieldset>{pin}</fieldset>
                        <h2>Personenkonstellation</h2>
                        <p>Autor: {author}</p>
                        <p>Lektüre: {book}</p>
                        <br/>
                        <br/>
                        <br/>
                        <button  className={"start"} onClick={handleStartRoom}>Start-tool</button>
                    </div>
                    <div className="right-half">
                        <h3 className="joiningUsers">Personen beigetreten:</h3>
                        <a>beigetretene Benutzer: </a>
                        {clients.map((client) => (
                            <li key={client}>{client}</li>
                        ))}
                        <button className="close" onClick={handleclose}>
                            x
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Lobby;

