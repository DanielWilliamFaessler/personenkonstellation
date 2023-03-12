import logo from './logo.svg';
import './Front.css';
import React, { useState, props, LoginForm } from 'react';
import {Button, Container, Form} from "react-bootstrap";
import Modal from "./Modal";

function Front() {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div id={"back"}>
            <h1>Personenkonstellation</h1>
            <div className={'container'}>
                <div className={'box1'}>
                    <Form id={"erstellen"}>
                        <h3 >Raum erstellen:</h3>
                        <label>Lektüretitel eingeben: </label>
                        <br/>
                        <input id="book" type={'text'}/>
                        <br/>
                        <br/>
                        <label>Autorenname eingeben: </label>
                        <br/>
                        <input id="author" type={'text'}/>
                        <br/>
                        <br/>
                        <button>erstellen</button>
                    </Form>
                </div>
                <div className={'box2'}>
                    <Form  id={"beitreten"}>
                        <h3>Raum beitreten:</h3>
                        <label>Benutzername eingeben: </label>
                        <br/>
                        <input id="username" type={'text'}/>
                        <br/>
                        <br/>
                        <label>Raumcode eingeben: </label>
                        <br/>
                        <input id="lobbycode" type={'text'}/>
                        <br/>
                        <br/>
                        <button onClick={() => setShowPopup(true)} >beitreten</button>
                    </Form>
                </div>
                <Modal show={showPopup} />
            </div>
        </div>
    );
}

export default Front;
