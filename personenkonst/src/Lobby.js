import logo from './logo.svg';
import './Lobby.css';
import React, { useState, props, LoginForm } from 'react';

function LobbyRandomPin() {
    const numbers = [];
    for (let i = 0; i < 6; i++) {
        const pin = Math.floor(Math.random() * 9) + 1;
        numbers.push(pin);
    }
    return <div className={"numbers"}>{numbers.join('')}</div>;
}

function Lobby() {

    return (
        <>
            <div className="container">
                <div className="left-half">
                    <h1>Raum beitreten: </h1>
                    <LobbyRandomPin />
                    <h2>Personenkonstellation</h2>
                    <p>Autor: ______________________</p>
                    <p>Lektüre: ______________________</p>

                </div>
                <div className="right-half">
                    <h3 className={"joiningUsers"}>Personen beigetreten: </h3>
                    <a>show users which joined</a>
                </div>
            </div>
        </>
    )
}

export default Lobby;
