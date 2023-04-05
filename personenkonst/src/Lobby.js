import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Joined from "./Joined";
import Lobby from "./Lobby";
import LobbyRandomPin from "./Lobby";
import {Form} from "react-bootstrap";
import useWebSocket from 'react-use-websocket';

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [showLobby, setShowLobby] = useState(false);
  const [autor, setAutor] = useState("");
  const [lektüre, setLektüre] = useState("");

  const [user, setUser] = useState("");
  const [connected, setConnected] = useState(false);
  const [pin, setPin] = useState("");

  const [error, setError] = useState("");

  /*
  //compare lobby pin and entered pin
    const handleJoin = () => {
        const ws = new WebSocket('ws://localhost:8000');

        ws.onopen = () => {
            console.log('Connected to server');
            ws.send(`join:${pin}`);
        };

        ws.onmessage = (event) => {
            console.log('Received message:', event.data);
            setConnected(event.data);
            ws.close();
        };

        ws.onclose = () => {
            console.log('Disconnected from server');
        };
    };
   */


    const handleJoin = () => {
      setShowPopup(true);
    }

  const handleClosepop = () => {
    setShowPopup(false);
    setShowLobby(false);
  };

  const handleCloselob = () => {
    setShowLobby(false);
  };

//create Lobby
  const handleCreateLobby = () => {
    setShowLobby(true);
  };


  //pin regex
  const isValidPin = (code) => {
    return /^\d{6}$/.test(code);
  };




  return (
      <div id={"back"}>

        {/*call components*/}
        <section>
          <h1 className={'title'}>Personenkonstellation</h1>
        </section>
        <Joined  show={showPopup} room={pin} user={user}  book={lektüre} author={autor} handleclose={handleClosepop} />
        {/*} <Lobby show={showLobby} book={lektüre} author={autor}   joiner={user} handleclose={handleCloselob}/>*/}
        <Lobby  show={showLobby} book={lektüre} author={autor}   joiner={user}  room={pin} handleclose={handleCloselob}/>

        <div className={'container'}>
          {/*create room field*/}
          <div className={'box1'}>
            <div id={"erstellen"}>
              <h3 >Raum erstellen:</h3>
              <label>Lektüretitel eingeben: </label>
              <br/>
              <input type={'text'} onChange={e => setLektüre(e.target.value)} />
              <br/>
              <br/>
              <label>Autorenname eingeben: </label>
              <br/>
              <input type={'text'}  onChange={e => setAutor(e.target.value)}/>
              <br/>
              <br/>
              <button   onClick={handleCreateLobby}>erstellen</button>
            </div>
          </div>

          {/*join room field*/}
          <div className={'box1'}>
            {connected ? (
                <Lobby />
            ) : (
            <div  id={"beitreten"}>
              <h3>Raum beitreten:</h3>
              <label>Benutzername eingeben: </label>
              <br/>
              <input type={'text'} value={user} onChange={(e) => setUser(e.target.value)}/>
              <br/>
              <br/>
              <label>Raumcode eingeben: </label>
              <br/>
              <input type={'text'} value={pin} onChange={(e) => setPin(e.target.value)} />
              <br/>
              <br/>
              <button onClick={handleJoin}>beitreten</button>
                {/*
                {connected === 'success' && <p>Successfully joined lobby!</p>}
                {connected === 'error' && <p>Invalid lobby pin.</p>}
                */}

            </div>
                )}
        </div>
        </div>
        </div>
  );
}

export default App;
