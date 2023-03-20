import logo from './logo.svg';
import './Front.css';
import React, { useState, props, LoginForm } from 'react';
import {Button, Container, Form} from "react-bootstrap";
import Modal from "./Modal";
import Lobby from "./Lobby";
import LobbyRandomPin from "./Lobby";

function Front() {
    const [showPopup, setShowPopup] = useState(false);
    const [showLobby, setShowLobby] = useState(false);
    const [autor, setAutor] = useState("");
    const [lektuere, setLektuere] = useState("");
    const [user, setUser] = useState("");
    const [code, setCode] = useState("");

    return (
        <div id={"back"}>
            {/* <h1 className={'title'}>Personenkonstellation</h1> */}
            <div className={'container'}>
                <div className={'box1'}>
                    <Form id={"erstellen"}>
                        <h3 >Raum erstellen:</h3>
                        <label>Lektüretitel eingeben: </label>
                        <br/>
                        <input type={'text'} onChange={e => setLektuere(e.target.value)} />
                        <br/>
                        <br/>
                        <label>Autorenname eingeben: </label>
                        <br/>
                        <input type={'text'}  onChange={e => setAutor(e.target.value)}/>
                        <br/>
                        <br/>
                        <button  onClick={() => setShowLobby(true)}>erstellen</button>
                    </Form>
                </div>
                <div className={'box1'}>
                    <Form  id={"beitreten"}>
                        <h3>Raum beitreten:</h3>
                        <label>Benutzername eingeben: </label>
                        <br/>
                        <input type={'text'} onChange={e => setUser(e.target.value)}/>
                        <br/>
                        <br/>
                        <label>Raumcode eingeben: </label>
                        <br/>
                        <input type={'text'}  onChange={e => setCode(e.target.value)}/>
                        <br/>
                        <br/>
                        <button onClick={() => setShowPopup(true)} >beitreten</button>
                    </Form>
                </div>
                <Modal show={showPopup} room={code} user={user} />
                <Lobby show={showLobby} book={lektuere} author={autor}/>
            </div>
        </div>
    );
}

export default Front;
