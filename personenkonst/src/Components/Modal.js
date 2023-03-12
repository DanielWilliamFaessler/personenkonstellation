import logo from './logo.svg';
import './Joined.css';
import React, { useState, props, LoginForm } from 'react';

function Modal({show, close}) {
    if (!show) return null;
    const handleclose =() => {
        show(false);
    }

    return (
        <div className={'modal'}>
            <div className={'modal-content'}>
                <h2>Personnenkonstellation</h2>
                <p>beigetreten als: @user</p>
                <p>Autor: ______________________</p>
                <p>Lektüre: ______________________</p>
                <p>..Warte auf den Host um anzufangen..</p>
                <button onClick={handleclose}>x</button>
            </div>
        </div>
    )
}

export default Modal;
