import logo from './logo.svg';
import './Lobby.css';
import React from 'react';

function LobbyRandomPin() {
    const numbers = [];
    for (let i = 0; i < 6; i++) {
        const pin = Math.floor(Math.random() * 9) + 1;
        numbers.push(pin);
    }
    return <div className={"numbers"}>{numbers.join('')}</div>;
}

function Lobby({show, author, book, code}) {
    if (!show) return null;

    return (
        <div className={"lobby"}>
            <div className="container">
                <div className="left-half">
                    <h1>Raum beitreten: </h1>
                    <LobbyRandomPin value={code} />
                    <h2>Personenkonstellation</h2>
                    <p>Autor: {author}</p>
                    <p>Lektüre: {book}</p>
            </div>
            <div className="right-half">
                <h3 className={"joiningUsers"}>Personen beigetreten: </h3>
                <a>show users which joined</a>
            </div>
        </div>
        </div>
    )
}

export default Lobby;
