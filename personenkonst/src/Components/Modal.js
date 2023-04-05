import logo from './logo.svg';
import './Joined.css';
import React, { useState, props, LoginForm } from 'react';

function Modal({show, room, user, author, book, handleclose }) {
    console.log(show);
    if (!show) return null;

 

    return (
        <div className={'modal'}>
            <div className={'modal-content'}>
                <h2>Personenkonstellation</h2>
                <p>beigetreten als: {user}</p>
                <p>im Raum {room}</p>
                <p>Autor: {author}</p>
                <p>Lektüre: {book}</p>
                <p>..Warte auf den Host um anzufangen..</p>
                <button className={"close"} onClick={handleclose} >x</button>
            </div>
        </div>
    )
}

export default Modal;
