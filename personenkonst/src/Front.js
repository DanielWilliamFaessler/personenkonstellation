import './App.css';
import React, { useState, useEffect } from 'react';
import Joined from "./Joined";
import io from 'socket.io-client';
import './Front.css';
import Lobby from "./Lobby";

const socket = io("http://localhost:5000");
function Front() {
    const [pin, setPin] = useState("");
    const [user, setUser] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [showLobby, setShowLobby] = useState(false);
    const [joined, setJoined] = useState(false);
    const [autor, setAutor] = useState("");
    const [lektüre, setLektüre] = useState("");
    const [host, setHost] = useState({});
    const [roomClients, setRoomClients] = useState([]);

    useEffect(() => {
        socket.on('room_joined', ({ clients }) => {
            setRoomClients(clients);
        });
        socket.on('room_left', ({ clients }) => {
            setRoomClients(clients);
        });
    }, []);


    const handleJoin = () => {
        socket.emit('join_lobby', { pin, user });
        setShowPopup(true);
        setJoined(true);
        socket.on('joined_lobby', ({ success }) => {
            if (success) {
                // Navigate the user to the tool component
                console.log('Joined the lobby successfully');
                setShowPopup(false);
                setPin('');
                setUser('');
                setJoined(false);
                setHost('');
                setRoomClients([]);
                window.location.href = '/Tool.js';
            } else {
                // Show an error message that the user entered the wrong pin
                console.log('Failed to join the lobby');
            }
        });
    };

    const handleClosepop = () => {
        setShowPopup(false);
    };

    const handleCloselob = () => {
        setShowLobby(false);
    };

    const handleCreateLobby = () => {
        setHost(user);
        socket.emit('create_lobby', { author: autor, book: lektüre, host: user });
        setShowLobby(true);

    };


    return (
        <div id="back">
            <section>
                <h1 className="title">Personenkonstellation</h1>
            </section>
            <Joined show={showPopup} room={pin} user={user} handleclose={handleClosepop} />
            <Lobby show={showLobby} book={lektüre} author={autor} joiner={user} host={host} room={pin} clients={roomClients} handleclose={handleCloselob}/>

            <div className="container">
            <div className="box1">
                <div id="erstellen">
                    <h3>Raum erstellen:</h3>
                    <label>Lektüretitel eingeben: </label>
                    <br />
                    <input type="text" onChange={(e) => setLektüre(e.target.value)} />
                    <br />
                    <br />
                    <label>Autorenname eingeben: </label>
                    <br />
                    <input type="text" onChange={(e) => setAutor(e.target.value)} />
                    <br />
                    <br />
                  <button onClick={handleCreateLobby}>erstellen</button>
                </div>
            </div>

            <div className="box1">
                <div id="beitreten">
                    <h3>Raum beitreten:</h3>
                    <label>Benutzername eingeben: </label>
                    <br />
                    <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />
                    <br />
                    <br />
                    <label>Raumcode eingeben: </label>
                    <br/>
                    <input type={'text'} value={pin} onChange={(e) => setPin(e.target.value)}/>
                    <br/>
                    <br/>
                    <button  onClick={handleJoin}>beitreten</button>
                </div>
            </div>
        </div>
        </div>
    );
}
export default Front;



