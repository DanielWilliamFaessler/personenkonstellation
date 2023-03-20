import logo from './logo.svg';
import './Joined.css';
import React, { useState, props, LoginForm } from 'react';

function Modal({show, room, user}) {
    if (!show) return null;

    const handleclose =() => {
        show(false);
    }

    return (
        <div className={'modal'}>
            <div className={'modal-content'}>
                <h2>Personnenkonstellation</h2>
                <p>beigetreten als: {user} im Raum {room}</p>
                <p>Autor: ________</p>
                <p>Lektüre: ________</p>
                <p>..Warte auf den Host um anzufangen..</p>
                <button className={"close"} onClick={handleclose}>x</button>
            </div>
        </div>
    )
}

export default Modal;
